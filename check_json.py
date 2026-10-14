with open('src/assets/i18n/fr.json', 'r', encoding='utf-8') as f:
    lines = f.readlines()

balance = 0
for i, line in enumerate(lines):
    opens = line.count('{')
    closes = line.count('}')
    if opens > 0 or closes > 0:
        balance += opens - closes
        if abs(balance) <= 2:
            print(f'Line {i+1:4d} (bal={balance:2d}): {line.strip()[:120]}')
print(f'Final balance: {sum(l.count("{") - l.count("}") for l in lines)}')