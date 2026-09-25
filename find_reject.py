with open('src/assets/i18n/fr.json', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the REJECT block end
pos = content.find('"REJECT": {')
balance = 0
for i in range(pos, len(content)):
    if content[i] == '{':
        balance += 1
    elif content[i] == '}':
        balance -= 1
        if balance == 0:
            reject_end = i
            print(f'REJECT ends at: {reject_end}')
            print('After REJECT:', repr(content[reject_end:reject_end+100]))
            break