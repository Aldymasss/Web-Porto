# Cara Menghubungkan dengan GitHub dan Mengaktifkan GitHub Pages

## 1. Hubungkan repositori lokal dengan GitHub

Setelah membuat repositori baru di GitHub (misalnya `paperplane-project-cafe`), jalankan perintah berikut di terminal:

```powershell
# Menambahkan remote origin yang mengarah ke repositori GitHub Anda
git remote add origin https://github.com/USERNAME/paperplane-project-cafe.git

# Push ke branch main di GitHub
git branch -M main
git push -u origin main
```

Ganti `USERNAME` dengan nama pengguna GitHub Anda.

## 2. Aktifkan GitHub Pages

1. Buka repositori Anda di GitHub
2. Klik tab "Settings"
3. Scroll ke bawah sampai menemukan bagian "GitHub Pages"
4. Pada bagian "Source", pilih branch "main" dan folder "/ (root)" 
5. Klik "Save"
6. Tunggu beberapa menit sampai website Anda dipublikasikan
7. Anda akan mendapatkan URL seperti `https://USERNAME.github.io/paperplane-project-cafe/`

## 3. Auto-Sync dengan GitHub Actions (Opsional)

Jika Anda ingin website otomatis terupdate setiap kali ada perubahan di repositori GitHub, Anda bisa menggunakan GitHub Actions:

1. Buat folder `.github/workflows` di repositori Anda
2. Buat file `deploy.yml` di dalam folder tersebut dengan konten:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2
      
      - name: Deploy to GitHub Pages
        uses: JamesIves/github-pages-deploy-action@4.1.1
        with:
          branch: gh-pages
          folder: .
```

Ini akan otomatis mendeploy perubahan setiap kali Anda melakukan push ke branch main.

## Cara Update Website

Setelah setup awal selesai, untuk melakukan update ke website:

1. Lakukan perubahan pada file-file lokal
2. Commit perubahan:
   ```powershell
   git add .
   git commit -m "Deskripsi perubahan yang dilakukan"
   ```
3. Push ke GitHub:
   ```powershell
   git push
   ```
4. Website akan otomatis terupdate setelah beberapa menit

---

Dengan setup ini, website Anda bisa diakses dari mana saja dengan URL GitHub Pages, dan setiap perubahan yang Anda push ke GitHub akan otomatis diperbarui di website.
