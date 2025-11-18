# Structure d'Internationalisation - Feature Authentication

## 📋 Vue d'ensemble

Cette documentation décrit la structure professionnelle et ingénierie de l'internationalisation (i18n) pour la feature **Authentication**.

## 🏗️ Architecture Hiérarchique

La structure suit une organisation hiérarchique par domaines fonctionnels pour une meilleure maintenabilité et scalabilité.

### Structure JSON

```json
{
  "AUTHENTICATION": {
    "TITLE": "...",
    "UI": { ... },
    "FORM": { ... },
    "MESSAGES": { ... }
  }
}
```

## 📂 Organisation par Domaines

### 1. **UI** - Interface Utilisateur
Contient tous les textes liés à l'interface utilisateur de la page de connexion.

```json
"AUTHENTICATION": {
  "UI": {
    "APP_TITLE": "Connect My Zone",
    "APP_SUBTITLE": "Your Gateway to Digital Excellence",
    "CONNECTION": "Connection",
    "CONNECT_BUTTON": "Connect",
    "FORGOT_PASSWORD": "Forgot password?",
    "FEATURES": {
      "SECURE_ACCESS": "Secure Access",
      "REAL_TIME_DASHBOARD": "Real-time Dashboard",
      "ADVANCED_ANALYTICS": "Advanced Analytics"
    }
  }
}
```

**Clés disponibles :**
- `AUTHENTICATION.UI.APP_TITLE` - Titre principal de l'application
- `AUTHENTICATION.UI.APP_SUBTITLE` - Sous-titre de l'application
- `AUTHENTICATION.UI.CONNECTION` - Label de connexion
- `AUTHENTICATION.UI.CONNECT_BUTTON` - Texte du bouton de connexion
- `AUTHENTICATION.UI.FORGOT_PASSWORD` - Lien mot de passe oublié
- `AUTHENTICATION.UI.FEATURES.SECURE_ACCESS` - Feature accès sécurisé
- `AUTHENTICATION.UI.FEATURES.REAL_TIME_DASHBOARD` - Feature tableau de bord
- `AUTHENTICATION.UI.FEATURES.ADVANCED_ANALYTICS` - Feature analyses

### 2. **FORM** - Formulaire de Connexion
Contient tous les textes liés aux champs du formulaire et leurs validations.

```json
"AUTHENTICATION": {
  "FORM": {
    "EMAIL": {
      "LABEL": "Username",
      "PLACEHOLDER": "app@yourmail.com",
      "REQUIRED": "Email is required",
      "INVALID_FORMAT": "Invalid email format"
    },
    "PASSWORD": {
      "LABEL": "Password",
      "REQUIRED": "Password is required"
    }
  }
}
```

**Clés disponibles :**
- `AUTHENTICATION.FORM.EMAIL.LABEL` - Label du champ email
- `AUTHENTICATION.FORM.EMAIL.PLACEHOLDER` - Placeholder du champ email
- `AUTHENTICATION.FORM.EMAIL.REQUIRED` - Message d'erreur email requis
- `AUTHENTICATION.FORM.EMAIL.INVALID_FORMAT` - Message d'erreur format invalide
- `AUTHENTICATION.FORM.PASSWORD.LABEL` - Label du champ mot de passe
- `AUTHENTICATION.FORM.PASSWORD.REQUIRED` - Message d'erreur mot de passe requis

### 3. **MESSAGES** - Messages Système
Contient tous les messages de succès et d'erreur générés par l'application.

```json
"AUTHENTICATION": {
  "MESSAGES": {
    "SUCCESS": {
      "WELCOME": "Welcome {lastName} {firstName}"
    },
    "ERROR": {
      "FAILED": "Authentication failed",
      "UNABLE_TO_COMPLETE_LOGIN": "Unable to complete login",
      "UNABLE_TO_LOAD_CONFIG": "Unable to load configuration",
      "UNABLE_TO_LOAD_VARIABLES": "Unable to load variables"
    }
  }
}
```

**Clés disponibles :**
- `AUTHENTICATION.MESSAGES.SUCCESS.WELCOME` - Message de bienvenue (avec paramètres)
- `AUTHENTICATION.MESSAGES.ERROR.FAILED` - Erreur d'authentification échouée
- `AUTHENTICATION.MESSAGES.ERROR.UNABLE_TO_COMPLETE_LOGIN` - Erreur connexion impossible
- `AUTHENTICATION.MESSAGES.ERROR.UNABLE_TO_LOAD_CONFIG` - Erreur chargement config
- `AUTHENTICATION.MESSAGES.ERROR.UNABLE_TO_LOAD_VARIABLES` - Erreur chargement variables

## 🔧 Utilisation dans le Code

### Dans les Templates HTML

```html
<!-- Titre de l'application -->
<h1>{{ 'AUTHENTICATION.UI.APP_TITLE' | translate }}</h1>

<!-- Label de formulaire -->
<label>{{ 'AUTHENTICATION.FORM.EMAIL.LABEL' | translate }}</label>

<!-- Placeholder -->
<input [placeholder]="'AUTHENTICATION.FORM.EMAIL.PLACEHOLDER' | translate" />

<!-- Message avec paramètres -->
{{ 'AUTHENTICATION.MESSAGES.SUCCESS.WELCOME' | translate: {lastName: 'Doe', firstName: 'John'} }}
```

### Dans les Services TypeScript

```typescript
// Avec TranslateService
const welcomeMessage = this.translateService.instant(
  'AUTHENTICATION.MESSAGES.SUCCESS.WELCOME',
  {
    lastName: session.user.last_name,
    firstName: session.user.first_name,
  }
);

// Codes d'erreur traduisibles
throw new Error('AUTHENTICATION.FORM.EMAIL.REQUIRED');
```

## 📝 Conventions de Nommage

### Structure des Clés

```
AUTHENTICATION.{DOMAIN}.{SUBDOMAIN}.{KEY}
```

**Exemples :**
- `AUTHENTICATION.UI.APP_TITLE` - UI → Titre de l'app
- `AUTHENTICATION.FORM.EMAIL.LABEL` - FORM → Email → Label
- `AUTHENTICATION.MESSAGES.ERROR.FAILED` - MESSAGES → ERROR → Failed

### Règles de Nommage

1. **Préfixe** : Toujours commencer par `AUTHENTICATION`
2. **Domaines** : Utiliser des noms en MAJUSCULES (UI, FORM, MESSAGES)
3. **Sous-domaines** : Utiliser des noms en MAJUSCULES (EMAIL, PASSWORD, SUCCESS, ERROR)
4. **Clés** : Utiliser SNAKE_CASE en MAJUSCULES (APP_TITLE, CONNECT_BUTTON)
5. **Hiérarchie** : Maximum 4 niveaux de profondeur

## 🌍 Fichiers de Traduction

### Français (`fr.json`)
- Toutes les traductions en français
- Structure identique à `en.json`
- Paramètres dynamiques supportés avec `{paramName}`

### Anglais (`en.json`)
- Toutes les traductions en anglais
- Structure identique à `fr.json`
- Paramètres dynamiques supportés avec `{paramName}`

## ✅ Avantages de cette Structure

1. **Maintenabilité** : Organisation claire par domaines fonctionnels
2. **Scalabilité** : Facile d'ajouter de nouvelles clés sans polluer l'espace de noms
3. **Découvrabilité** : Structure hiérarchique facilite la recherche
4. **Cohérence** : Conventions de nommage uniformes
5. **Séparation des préoccupations** : UI, FORM, MESSAGES séparés
6. **Type Safety** : Structure prévisible pour l'autocomplétion IDE

## 🔄 Migration depuis l'ancienne structure

### Ancienne structure (plate)
```json
{
  "AUTHENTICATION_WELCOME": "...",
  "AUTHENTICATION_FAILED": "..."
}
```

### Nouvelle structure (hiérarchique)
```json
{
  "AUTHENTICATION": {
    "MESSAGES": {
      "SUCCESS": {
        "WELCOME": "..."
      },
      "ERROR": {
        "FAILED": "..."
      }
    }
  }
}
```

### Mapping des clés

| Ancienne Clé | Nouvelle Clé |
|-------------|--------------|
| `AUTHENTICATION_WELCOME` | `AUTHENTICATION.MESSAGES.SUCCESS.WELCOME` |
| `AUTHENTICATION_FAILED` | `AUTHENTICATION.MESSAGES.ERROR.FAILED` |
| `AUTHENTICATION_EMAIL_REQUIRED` | `AUTHENTICATION.FORM.EMAIL.REQUIRED` |
| `AUTHENTICATION_APP_TITLE` | `AUTHENTICATION.UI.APP_TITLE` |

## 📚 Références

- [Angular i18n Documentation](https://angular.io/guide/i18n)
- [ngx-translate Documentation](https://github.com/ngx-translate/core)
- [JSON Structure Best Practices](https://jsonapi.org/)

