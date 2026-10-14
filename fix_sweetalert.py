with open('src/presentation/pages/sla/presentation/features/sla-list/sla-list.component.ts', 'r') as f:
    content = f.read()

# Comment out SweetAlert import and usage
content = content.replace("import SweetAlert from 'sweetalert2';", "// import SweetAlert from 'sweetalert2'")
content = content.replace("SweetAlert.fire", "Promise.resolve({ isConfirmed: true })")

with open('src/presentation/pages/sla/presentation/features/sla-list/sla-list.component.ts', 'w') as f:
    f.write(content)
print('Commented out SweetAlert')