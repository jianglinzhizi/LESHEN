#!/usr/bin/env python3
"""Import LESHEN WeChat DOCX articles into the website blog catalog."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import re
import shutil
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

from docx import Document
from PIL import Image


FEATURED_SOURCE = "LESHEN 乐绅 我们如何经营业务.docx"
CATEGORIES = ["全部", "男士假发", "假发保养", "男士发型", "发际线", "品牌理念"]
CATEGORY_LABELS = {
    "全部": {"zh": "全部", "en": "All"},
    "男士假发": {"zh": "男士假发", "en": "Men Hair Systems"},
    "假发保养": {"zh": "假发保养", "en": "Care"},
    "男士发型": {"zh": "男士发型", "en": "Men Hairstyles"},
    "发际线": {"zh": "发际线", "en": "Hairline"},
    "品牌理念": {"zh": "品牌理念", "en": "Brand Principles"},
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path, help="Folder containing the WeChat DOCX articles")
    parser.add_argument("--project", type=Path, required=True, help="Website project root")
    return parser.parse_args()


def image_relationship_ids(paragraph) -> list[str]:
    return paragraph._p.xpath(".//a:blip/@r:embed")


def classify_article(title: str, featured: bool) -> str:
    if featured:
        return "品牌理念"
    if "发际线" in title:
        return "发际线"
    if any(word in title for word in ("护理", "毛躁", "打结", "褪色", "维护", "恢复发型", "使用多久")):
        return "假发保养"
    if any(word in title for word in ("发型", "发量", "密度", "配色", "发色")):
        return "男士发型"
    return "男士假发"


def article_tags(title: str, category: str) -> list[str]:
    terms = [
        "发际线",
        "发量",
        "密度",
        "发色",
        "配色",
        "佩戴",
        "护理",
        "维护",
        "咨询",
        "价格",
        "试戴",
        "形象",
    ]
    tags = [category]
    tags.extend(term for term in terms if term in title and term not in tags)
    return tags[:3]


def article_id(source_name: str, featured: bool) -> str:
    if featured:
        return "leshen-business-principles"
    digest = hashlib.sha1(source_name.encode("utf-8")).hexdigest()[:10]
    return f"wechat-{digest}"


def is_heading(text: str, style_name: str) -> tuple[bool, int]:
    lowered = style_name.lower()
    if lowered.startswith("heading"):
        match = re.search(r"(\d+)", lowered)
        return True, min(int(match.group(1)) if match else 2, 3)
    if re.match(r"^[一二三四五六七八九十百]+[、，]", text):
        return True, 2
    return False, 0


def extract_summary(paragraphs) -> tuple[str, int]:
    for index, paragraph in enumerate(paragraphs[:8]):
        text = paragraph.text.strip()
        if not text.startswith("摘要："):
            continue
        summary = text.removeprefix("摘要：").strip()
        next_index = index + 1
        if not summary:
            while next_index < len(paragraphs) and not paragraphs[next_index].text.strip():
                next_index += 1
            if next_index < len(paragraphs):
                summary = paragraphs[next_index].text.strip()
                next_index += 1
        return summary, next_index
    return "", 1


def save_webp(blob: bytes, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    from io import BytesIO

    with Image.open(BytesIO(blob)) as image:
        image.load()
        if image.mode not in ("RGB", "RGBA"):
            image = image.convert("RGBA" if "transparency" in image.info else "RGB")
        if image.mode == "RGBA":
            background = Image.new("RGB", image.size, "white")
            background.paste(image, mask=image.getchannel("A"))
            image = background
        if image.width > 1440:
            height = round(image.height * 1440 / image.width)
            image = image.resize((1440, height), Image.Resampling.LANCZOS)
        image.save(destination, "WEBP", quality=82, method=6)


def extract_article(source: Path, assets_root: Path) -> dict:
    document = Document(source)
    paragraphs = document.paragraphs
    title = next((paragraph.text.strip() for paragraph in paragraphs if paragraph.text.strip()), source.stem)
    featured = source.name == FEATURED_SOURCE
    identifier = article_id(source.name, featured)
    article_assets = assets_root / identifier
    summary, body_start = extract_summary(paragraphs)
    content = []
    cover_image = ""
    image_number = 0

    for index, paragraph in enumerate(paragraphs):
        text = paragraph.text.strip()
        relationship_ids = image_relationship_ids(paragraph)

        if index >= body_start and text and text != "⸻":
            heading, level = is_heading(text, paragraph.style.name)
            content.append(
                {"type": "heading", "level": level, "text": text}
                if heading
                else {"type": "paragraph", "text": text}
            )

        for relationship_id in relationship_ids:
            image_number += 1
            filename = "cover.webp" if not cover_image else f"image-{image_number:02d}.webp"
            output_path = article_assets / filename
            save_webp(document.part.rels[relationship_id].target_part.blob, output_path)
            web_path = f"/blog/{identifier}/{filename}"
            if not cover_image:
                cover_image = web_path
            elif index >= body_start:
                content.append(
                    {
                        "type": "image",
                        "src": web_path,
                        "alt": text or f"{title} 配图 {image_number}",
                    }
                )

    body_characters = sum(len(block.get("text", "")) for block in content)
    modified_at = datetime.fromtimestamp(source.stat().st_mtime, ZoneInfo("Asia/Shanghai"))
    category = classify_article(title, featured)

    return {
        "id": identifier,
        "title": title,
        "category": category,
        "summary": summary,
        "content": content,
        "tags": article_tags(title, category),
        "readTime": f"{max(3, math.ceil(body_characters / 450))} 分钟",
        "date": modified_at.date().isoformat(),
        "modifiedAt": modified_at.isoformat(timespec="seconds"),
        "featured": featured,
        "coverImage": cover_image,
        "sourceFile": source.name,
    }


def write_catalog(destination: Path, articles: list[dict]) -> None:
    content = (
        "// 此文件由 scripts/import_wechat_blog.py 从公众号 Word 文档生成。\n"
        f"export const blogCategories = {json.dumps(CATEGORIES, ensure_ascii=False, indent=2)}\n\n"
        f"export const blogCategoryLabels = {json.dumps(CATEGORY_LABELS, ensure_ascii=False, indent=2)}\n\n"
        f"export const blogArticles = {json.dumps(articles, ensure_ascii=False, indent=2)}\n"
    )
    destination.write_text(content, encoding="utf-8")


def write_content_modules(project: Path, articles: list[dict]) -> None:
    modules_root = project / "src" / "content" / "blogArticles"
    if modules_root.exists():
        shutil.rmtree(modules_root)
    modules_root.mkdir(parents=True)

    loader_lines = ["const articleLoaders = {"]
    for article in articles:
        identifier = article["id"]
        module_path = modules_root / f"{identifier}.js"
        module_path.write_text(
            f"export default {json.dumps(article['content'], ensure_ascii=False, indent=2)}\n",
            encoding="utf-8",
        )
        loader_lines.append(
            f"  {json.dumps(identifier)}: () => import('./blogArticles/{identifier}.js'),"
        )

    loader_lines.extend(
        [
            "}",
            "",
            "export async function loadArticleContent(articleId) {",
            "  const loader = articleLoaders[articleId]",
            "  if (!loader) throw new Error(`Unknown article: ${articleId}`)",
            "  const module = await loader()",
            "  return module.default",
            "}",
            "",
        ]
    )
    (project / "src" / "content" / "blogLoaders.js").write_text(
        "\n".join(loader_lines),
        encoding="utf-8",
    )


def main() -> None:
    args = parse_args()
    source_files = sorted(args.source.glob("*.docx"), key=lambda path: path.stat().st_mtime)
    if len(source_files) != 26:
        raise SystemExit(f"Expected 26 DOCX files, found {len(source_files)}")
    if not any(path.name == FEATURED_SOURCE for path in source_files):
        raise SystemExit(f"Featured source is missing: {FEATURED_SOURCE}")

    assets_root = args.project / "public" / "blog"
    if assets_root.exists():
        shutil.rmtree(assets_root)
    assets_root.mkdir(parents=True)

    articles = [extract_article(source, assets_root) for source in source_files]
    regular_articles = sorted(
        (article for article in articles if not article["featured"]),
        key=lambda article: article["modifiedAt"],
    )
    featured_article = next(article for article in articles if article["featured"])
    ordered_articles = regular_articles + [featured_article]
    write_content_modules(args.project, ordered_articles)
    catalog_articles = [
        {key: value for key, value in article.items() if key != "content"}
        for article in ordered_articles
    ]
    write_catalog(args.project / "src" / "content" / "blog.js", catalog_articles)

    print(f"Imported {len(articles)} articles and {sum(1 for _ in assets_root.rglob('*.webp'))} images")


if __name__ == "__main__":
    main()
