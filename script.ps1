git fetch --force
$array = @('Node','NPM')
$version = @("Node.js $(node -v)","NPM $(npm -v)")

Foreach ($i in $array)
{
 $json = Get-Content "$($i).json" | Out-String | ConvertFrom-Json
 $json.message = "$($version[[array]::IndexOf($array, $i)])"
 $json | ConvertTo-Json | Out-File "$($i).json"
}

git add --all
git commit -m '[Script] Update metadata'
git push