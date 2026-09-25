$ErrorActionPreference = 'Stop'
$base = Split-Path -Parent $MyInvocation.MyCommand.Path
$items = @(
  @{ Folder='Maruti Suzuki Swift'; File='Maruti Suzuki Swift.jpg'; Url='https://upload.wikimedia.org/wikipedia/commons/e/e7/2024_Suzuki_Swift.jpg' },
  @{ Folder='Mahindra Thar 4x4 Hard-Top'; File='Mahindra Thar 4x4 Hard-Top.jpg'; Url='https://upload.wikimedia.org/wikipedia/commons/2/2d/Mahindra_Thar.jpg' },
  @{ Folder='Hyundai Creta SX Turbo'; File='Hyundai Creta SX Turbo.jpg'; Url='https://upload.wikimedia.org/wikipedia/commons/9/93/Hyundai_Creta_A740048.jpg' },
  @{ Folder='Volkswagen Virtus GT'; File='Volkswagen Virtus GT.png'; Url='https://upload.wikimedia.org/wikipedia/commons/9/96/2022_Volkswagen_Virtus_1.5_GT_%28India%29_front_view_01.png' },
  @{ Folder='Tata Punch'; File='Tata Punch.png'; Url='https://upload.wikimedia.org/wikipedia/commons/1/1e/2021_Tata_Punch_Creative_%28India%29_front_view_01.png' },
  @{ Folder='Hyundai i20'; File='Hyundai i20.jpg'; Url='https://upload.wikimedia.org/wikipedia/commons/e/e8/2022_Hyundai_i20.jpg' },
  @{ Folder='Hyundai Verna SX CRDi'; File='Hyundai Verna SX CRDi.jpg'; Url='https://upload.wikimedia.org/wikipedia/commons/8/8e/Hyundai_Verna_On_road.jpg' },
  @{ Folder='Tata Nexon EV Max'; File='Tata Nexon EV Max.jpg'; Url='https://upload.wikimedia.org/wikipedia/commons/0/04/Tata_Nexon_EV_in_Hyderabad_01.jpg' }
)
foreach ($x in $items) {
  $dest = Join-Path (Join-Path $base $x.Folder) $x.File
  Write-Host "Downloading $($x.Folder)..."
  Invoke-WebRequest -Uri $x.Url -OutFile $dest
}
Write-Host 'Done. All 8 car images downloaded.'
