with open('src/assets/i18n/fr.json', 'r', encoding='utf-8') as f:
    content = f.read()

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
            print(f'SWEET_ALERT ends at: {sweet_end}')
            print('After SWEET_ALERT:', repr(content[sweet_end:sweet_end+50]))
            break