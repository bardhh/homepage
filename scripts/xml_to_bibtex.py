import xml.etree.ElementTree as ET
import os
import re

def convert_xml_to_bibtex(xml_path, output_path, legacy_base_path):
    tree = ET.parse(xml_path)
    root = tree.getroot()
    
    bibtex_entries = []
    
    for paper in root.findall('paper'):
        entry_type = paper.get('type', 'misc')
        bib_type = 'misc'
        if entry_type == 'jour':
            bib_type = 'article'
        elif entry_type == 'conf':
            bib_type = 'inproceedings'
        elif entry_type == 'work':
            bib_type = 'inproceedings' # Workshops are often inproceedings
            
        tag_elem = paper.find('tag')
        tag = tag_elem.text.strip().replace(' ', '_') if tag_elem is not None else 'unknown'

        title_elem = paper.find('title')
        title = title_elem.text.strip() if title_elem is not None else ''

        authors_elem = paper.find('authors')
        authors = authors_elem.text.strip() if authors_elem is not None else ''

        other_elem = paper.find('other')
        venue_year = other_elem.text.strip() if other_elem is not None else ''
        
        # Extract year from venue string if possible (simple regex for 4 digits)
        year_match = re.search(r'\b(19|20)\d{2}\b', venue_year)
        year = year_match.group(0) if year_match else ''
        
        # Custom fields
        links = paper.findall('link')
        link = links[0].text.strip() if links else ''
        
        video_elem = paper.find('video')
        video = video_elem.text.strip() if video_elem is not None else ''

        code_elem = paper.find('code')
        code = code_elem.text.strip() if code_elem is not None else ''

        award_elem = paper.find('award')
        award = award_elem.text.strip() if award_elem is not None else ''
        
        themes = [t.text.strip() for t in paper.findall('theme')]
        keywords = ', '.join(themes)
        
        # Check if there is an existing bibtex file to merge
        bib_file_ref = paper.find('bibtex')
        existing_bib_content = ""
        
        if bib_file_ref is not None and bib_file_ref.text:
            bib_path = os.path.join(legacy_base_path, bib_file_ref.text.strip())
            if os.path.exists(bib_path):
                try:
                    with open(bib_path, 'r') as f:
                        existing_bib_content = f.read()
                        # Basic parsing to get the content inside {}
                        # This is a bit hacky, assuming standard format
                        start = existing_bib_content.find('{')
                        end = existing_bib_content.rfind('}')
                        if start != -1 and end != -1:
                            # We could use the existing entry, but we want to inject our custom fields
                            # So let's just append our custom fields to the existing content
                            # actually, let's just use the existing content and inject fields before the last brace
                            pass
                except Exception as e:
                    print(f"Error reading bib file {bib_path}: {e}")

        # Construct entry
        # If we have existing content, try to inject fields. Otherwise create new.
        if existing_bib_content:
            # Remove the last closing brace safely
            content = existing_bib_content.strip()
            last_brace_idx = content.rfind('}')
            if last_brace_idx != -1:
                content = content[:last_brace_idx]
            
            # Add custom fields
            if video: content += f',\n  video = {{{video}}}'
            if code: content += f',\n  code = {{{code}}}'
            if award: content += f',\n  award = {{{award}}}'
            if link: content += f',\n  url = {{{link}}}'
            if keywords: content += f',\n  keywords = {{{keywords}}}'
            
            content += '\n}'
            bibtex_entries.append(content)
        else:
            # Create fresh entry
            entry = f"@{bib_type}{{{tag},\n"
            entry += f"  title = {{{title}}},\n"
            entry += f"  author = {{{authors.replace(',', ' and')}}},\n" # Basic author fix
            entry += f"  booktitle = {{{venue_year}}},\n"
            if year: entry += f"  year = {{{year}}},\n"
            if link: entry += f"  url = {{{link}}},\n"
            if video: entry += f"  video = {{{video}}},\n"
            if code: entry += f"  code = {{{code}}},\n"
            if award: entry += f"  award = {{{award}}},\n"
            if keywords: entry += f"  keywords = {{{keywords}}},\n"
            entry += "}"
            bibtex_entries.append(entry)

    with open(output_path, 'w') as f:
        f.write('\n\n'.join(bibtex_entries))
    
    print(f"Successfully converted {len(bibtex_entries)} entries to {output_path}")

if __name__ == "__main__":
    xml_path = "legacy_site/papers.xml"
    output_path = "public/publications-new.bib"
    legacy_base_path = "legacy_site"
    convert_xml_to_bibtex(xml_path, output_path, legacy_base_path)
