with open('src/assets/i18n/fr.json', 'r', encoding='utf-8') as f:
    content = f.read()

# Find SWEET_ALERT end in REJECT block
pos = content.find('"REJECT": {')
sweet_pos = content.find('"SWEET_ALERT": {', pos)
balance = 0
for i in range(sweet_pos, len(content)):
    if content[i] == '{':
        balance += 1
    elif content[i] == '}':
        balance -= 1
        if balance == 0:
            sweet_end = i
            break

# Insert STATS after SWEET_ALERT end, before the closing of REJECT
stats_block = ''',\n        "STATS": {\n            "TITLE": "Répartition par motif de rejet",\n            "TOTAL": {\n                "LABEL": "Total rejets"\n            },\n            "DUP": {\n                "LABEL": "Duplicata (DUP)"\n            },\n            "HOP": {\n                "LABEL": "Hors périmètre (HOP)"\n            },\n            "IFM": {\n                "LABEL": "Informations manquantes (IFM)"\n            },\n            "FAS": {\n                "LABEL": "Faux signalement (FAS)"\n            },\n            "AUT": {\n                "LABEL": "Autre (AUT)"\n            }\n        }'''

# Insert after sweet_end (which is the } of SWEET_ALERT)
# The next chars should be }\n        },\n        "CLOSE"
# We need to insert after the } of SWEET_ALERT and add a comma
insert_pos = sweet_end + 1  # after the }

new_content = content[:insert_pos] + stats_block + content[insert_pos:]

with open('src/assets/i18n/fr.json', 'w', encoding='utf-8') as f:
    f.write(new_content)

print('STATS block inserted inside REJECT')