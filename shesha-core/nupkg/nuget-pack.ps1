# Paths
$currentFolder = (Get-Item -Path "./" -Verbose).FullName
$packFolder = "$($currentFolder)/packages/"
New-Item -ItemType Directory -Force -Path $packFolder
$slnPath = Join-Path $currentFolder "../"
$srcPath = Join-Path $slnPath "src"

# List of projects
$projects = (
	"Shesha.IO.Application",
	"Shesha.IO.AzureAD",
	"Shesha.IO.Core",
	"Shesha.IO.Elmah",
	"Shesha.IO.Firebase",
	"Shesha.IO.FluentMigrator",
	"Shesha.IO.Framework",
	"Shesha.IO.GraphQL",
	"Shesha.IO.Import",
	"Shesha.IO.Ldap",
	"Shesha.IO.MongoRepository",
	"Shesha.IO.NHibernate",
	"Shesha.IO.RestSharp",
	"Shesha.IO.Scheduler",
	"Shesha.IO.Sms.BulkSms",
	"Shesha.IO.Sms.Clickatell",
	"Shesha.IO.Sms.SmsPortal",
	"Shesha.IO.Sms.Xml2Sms",
	"Shesha.IO.Web.FormsDesigner"
)

# Rebuild solution
Set-Location $slnPath
& dotnet restore

# Copy all nuget packages to the pack folder
foreach($project in $projects) {
    
    $projectFolder = Join-Path $srcPath $project

    # Create nuget pack
    Set-Location $projectFolder
    Get-ChildItem (Join-Path $projectFolder "bin/Release") -ErrorAction SilentlyContinue | Remove-Item -Recurse
    & dotnet msbuild /p:Configuration=Release
    & dotnet msbuild /p:Configuration=Release /t:pack /p:IncludeSymbols=true /p:SymbolPackageFormat=snupkg

    # Copy nuget package
    $projectPackPath = Join-Path $projectFolder ("/bin/Release/" + $project + ".*.nupkg")
    Move-Item $projectPackPath $packFolder

	# Copy symbol package
    $projectPackPath = Join-Path $projectFolder ("/bin/Release/" + $project + ".*.snupkg")
    Move-Item $projectPackPath $packFolder
}

# Go back to the source folder
Set-Location $currentFolder