git fetch --force
$array = @('Node','NPM','Yarn')
$version = @("Node.js $(node -v)","NPM $(npm -v)","Yarn $(Yarn -v)")

Foreach ($i in $array)
{
 $json = Get-Content "$($i).json" | Out-String | ConvertFrom-Json
 $json.message = "$($version[[array]::IndexOf($array, $i)])"
 $json | ConvertTo-Json -Depth 100 | Set-Content "$($i).json"
}

git add --all
git commit -m '[Script] Update metadata'
git push