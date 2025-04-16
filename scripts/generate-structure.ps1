# Définir le chemin de base pour les modules
$baseModulePath = Resolve-Path "src/presentation/pages"

# Vérifier si le répertoire de base existe
if (-not (Test-Path $baseModulePath)) {
    Write-Host "❌ Le répertoire de base '$baseModulePath' n'existe pas."
    exit
}

# Se déplacer dans le répertoire de base
Set-Location $baseModulePath

# Demander à l'utilisateur ce qu'il souhaite faire
$includeMainModule = Read-Host "Créer un module principal (NEW) | Utiliser un module principal existant (EXIST) | Annuler (NULL) ?"

if ($includeMainModule -eq "NEW") {
    # Créer un nouveau module principal
    $moduleName = (Read-Host "Entrez le nom du module principal (ex: comptabilite)").Trim()

    # Générer le module Angular avec le routage
    ng g module "$moduleName" --routing
    if ($?) {
        Write-Host "✅ Module principal '$moduleName' généré avec succès dans '$baseModulePath'"
        # Mettre à jour le chemin complet du module
        $fullModulePath = Join-Path -Path $baseModulePath -ChildPath $moduleName
        # Se déplacer dans le répertoire de base
        Set-Location $fullModulePath
    } else {
        Write-Host "❌ Erreur lors de la génération du module principal '$moduleName'."
        exit
    }

} elseif ($includeMainModule -eq "EXIST") {
    # Utiliser un module principal existant
    $moduleName = (Read-Host "Entrez le nom du module principal existant").Trim()

    # Construire le chemin complet du module
    $fullModulePath = Join-Path -Path $baseModulePath -ChildPath $moduleName
    # Vérifier si le dossier existe
    if (Test-Path $fullModulePath) {
        Set-Location $fullModulePath
        Write-Host "✅ Module principal '$moduleName' sélectionné."
    } else {
        Write-Host "❌ Le dossier '$fullModulePath' n'existe pas."
        Write-Host "Dossiers disponibles :"

        # Lister les dossiers disponibles
        $availableFolders = Get-ChildItem -Path $baseModulePath -Directory
        $availableFolders | ForEach-Object { $i = 1 } { Write-Host "$i. $($_.Name)"; $i++ }

        # Demander à l'utilisateur de sélectionner un dossier
        $selectedIndex = Read-Host "Veuillez sélectionner un dossier en entrant son numéro (ou appuyez sur Entrée pour annuler)"

        if ($selectedIndex -and $selectedIndex -ge 1 -and $selectedIndex -le $availableFolders.Count) {
            # Si l'utilisateur a sélectionné un dossier valide
            $selectedFolder = $availableFolders[$selectedIndex - 1].Name
            $fullModulePath = Join-Path -Path $baseModulePath -ChildPath $selectedFolder
            Set-Location $fullModulePath
            Write-Host "✅ Dossier sélectionné : '$fullModulePath'"
        } else {
            # Si l'utilisateur annule ou sélectionne un dossier invalide
            Write-Host "❌ Aucun dossier valide sélectionné. Opération annulée."
            exit
        }
    }

} else {
    # Annuler l'opération
    Write-Host "❌ Opération annulée."
    exit
}

# Fonction pour créer un sous-module dans une structure existante
function Create-SubModule {
    param (
        [string]$subModuleName
    )

    # Chemin des dossiers existants
    $dataAccessPath = Join-Path -Path $fullModulePath -ChildPath "data-access/$subModuleName"
    $featurePath = Join-Path -Path $fullModulePath -ChildPath "feature/$subModuleName"
    $uiPath = Join-Path -Path $fullModulePath -ChildPath "ui/$subModuleName"

    # Créer le module data-access
    if (-not (Test-Path $dataAccessPath)) {
        New-Item -ItemType Directory -Path "$dataAccessPath/service" -Force | Out-Null
        New-Item -ItemType Directory -Path "$dataAccessPath/interface" -Force | Out-Null
        New-Item -ItemType Directory -Path "$dataAccessPath/enum" -Force | Out-Null

        ng g service "data-access/$subModuleName/service/$subModuleName"
        ng generate interface "data-access/$subModuleName/interface/$subModuleName"
        New-Item -ItemType File -Path "$dataAccessPath/enum/$subModuleName-status.enum.ts"
        Write-Host "✅ Module data-access pour '$subModuleName' généré avec succès."
    } else {
        Write-Host "⚠️ Le dossier '$dataAccessPath' existe déjà."
    }

    # Créer le module feature
    if (-not (Test-Path $featurePath)) {
        New-Item -ItemType Directory -Path "$featurePath/filter-$subModuleName" -Force
        New-Item -ItemType Directory -Path "$featurePath/table-$subModuleName" -Force

        ng g component "feature/$subModuleName/filter-$subModuleName"
        ng g component "feature/$subModuleName/table-$subModuleName"
        Write-Host "✅ Module feature pour '$subModuleName' généré avec succès."
    } else {
        Write-Host "⚠️ Le dossier '$featurePath' existe déjà."
    }

    # Créer le module ui
    if (-not (Test-Path $uiPath)) {
        New-Item -ItemType Directory -Path $uiPath -Force | Out-Null
        # Se déplacer dans le dossier du module principal avant de générer le composant
        Set-Location $fullModulePath
        ng g component "ui/$subModuleName"
        Write-Host "✅ Module ui pour '$subModuleName' généré avec succès."
    } else {
        Write-Host "⚠️ Le dossier '$uiPath' existe déjà."
    }
}

# Demander si un sous-module doit être créé
$includeSubModule = Read-Host "Voulez-vous inclure un sous-module ? (y/n)"

if ($includeSubModule -eq "y") {
    do {
        $subModuleName = (Read-Host "Entrez le nom du sous-module (ex: invoice)").Trim()
        if (-not [string]::IsNullOrEmpty($subModuleName)) {
            Create-SubModule -subModuleName $subModuleName
        } else {
            Write-Host "❌ Le nom du sous-module ne peut pas être vide."
        }

        # Demander si l'utilisateur souhaite ajouter un autre sous-module
        $addAnother = Read-Host "Voulez-vous ajouter un autre sous-module ? (y/n)"
    } while ($addAnother -eq "y")
} else {
    Write-Host "❌ Aucun sous-module généré."
    exit
}

Write-Host "🎉 Structure personnalisée générée avec succès !"