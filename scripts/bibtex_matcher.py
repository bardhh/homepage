import xml.etree.ElementTree as ET
import re
import os

def find_matching_paper(root, title):
    for paper in root.findall('paper'):
        paper_title = paper.find('title').text.strip().lower()
        if paper_title == title.lower():
            return paper
    return None

def create_bibtex_file(bibtex_entry, file_name, bibtex_folder):
    file_path = os.path.join(bibtex_folder, file_name)
    with open(file_path, 'w') as file:
        file.write(bibtex_entry)
    return file_path

def extract_first_author_lastname(bibtex_entry):
    author_search = re.search(r"author\s*=\s*{([^}]*)}", bibtex_entry)
    if not author_search:
        raise ValueError("Author not found in BibTeX entry")

    first_author = author_search.group(1).split(',')[0]  # Assume last name is before the comma
    return first_author.strip()

def add_bibtex_link_to_xml(xml_path, bibtex_entries, bibtex_folder):
    # Create the folder for BibTeX files if it doesn't exist
    if not os.path.exists(bibtex_folder):
        os.makedirs(bibtex_folder)

    # Parse the XML file
    tree = ET.parse(xml_path)
    root = tree.getroot()

    for bibtex_entry in bibtex_entries:
        # Extract the title from the BibTeX entry
        title_search = re.search(r"title\s*=\s*{([^}]*)}", bibtex_entry)
        if not title_search:
            print("Title not found in BibTeX entry, skipping:")
            print(bibtex_entry)
            continue
        title = title_search.group(1)

        # Find the matching paper
        matching_paper = find_matching_paper(root, title)
        if not matching_paper:
            print(f"No matching paper found for title: {title}, skipping.")
            continue

        # Extract the first author's last name
        try:
            first_author_lastname = extract_first_author_lastname(bibtex_entry)
        except ValueError as e:
            print(e)
            continue

        # Get the tag from the XML
        tag = matching_paper.find('tag').text.strip()

        # Create a file name
        bibtex_file_name = f"{tag}_{first_author_lastname}.bib"

        # Create a BibTeX file and get its path
        bibtex_file_path = create_bibtex_file(bibtex_entry, bibtex_file_name, bibtex_folder)

        # Add the BibTeX file link to the XML
        bibtex_element = ET.SubElement(matching_paper, "bibtex")
        bibtex_element.text = bibtex_file_path

    # Save the updated XML
    tree.write('updated_papers.xml')

def read_bibtex_entries(bibtex_file_path):
    with open(bibtex_file_path, 'r') as file:
        content = file.read()
        entries = content.split('@')[1:]  # First element is empty
        return ['@' + entry.strip() for entry in entries]

# Paths
bibtex_file_path = 'scripts/bibtex_lst.txt'
bibtex_folder = 'bibtex'

# Read BibTeX entries from file
bibtex_entries = read_bibtex_entries(bibtex_file_path)

# Update the XML file with BibTeX links
add_bibtex_link_to_xml('papers.xml', bibtex_entries, bibtex_folder)
