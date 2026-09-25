with open('src/assets/i18n/fr.json', 'r', encoding='utf-8') as f:
    content = f.read()

# Verify REJECT block has STATS inside
pos = content.find('"REJECT": {')
if pos > 0:
    stats_pos = content.find('"STATS": {', pos)
    print('REJECT STATS found at:', stats_pos)
    # Check it's inside REJECT by finding the REJECT block end
    # Count braces from REJECT start
    balance = 0
    for i in range(pos, len(content)):
        if content[i] == '{':
            balance += 1
        elif content[i] == '}':
            balance -= 1
            if balance == 0:
                print(f'REJECT block ends at position {i}')
                # Check if STATS is before this
                if stats_pos < i:
                    print('STATS is INSIDE REJECT block: YES')
                else:
                    print('STATS is INSIDE REJECT block: NO')
                break