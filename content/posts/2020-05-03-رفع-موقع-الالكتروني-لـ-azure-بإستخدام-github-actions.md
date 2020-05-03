---
template: post
title: رفع موقع الالكتروني لـ Azure بإستخدام Github Actions
slug: 'كيف تربط نظامك في Github مع Azure بواسطة Github Actions '
draft: false
date: 2020-05-03T04:31:28.540Z
description: 'كيف تربط نظامك في Github مع Azure بواسطة Github Actions '
category: تقنية،برمجة
tags:
  - تقنية، برمجية، CI\CD
---
تم الإعلان عن github actions في اوغست ٢٠١٩ إذا ما سمعت فيها سابقاً فهي خدمة تقوم بعمل الأعمال المتكررة عوضاً عنك ومنها continuous integration و continuous deployment أو التي تعرف بإختصار CI\CD

في هذه المقالة سنشرح طريقة رفع تطبيق يعمل على dotnet core لخدمات Azure السحابية بإستخدام github actions كما يمكنك رفع أي تطبيق آخر مثل node أو غيره وسأرفق آخر المقالة بعض المراجع التي بإمكانك الإستفادة منها.

## متطلبات سابقة:

1. حساب في Azure و Web App
2. Github Repository


## أولاً: الحصول على مفاتح الوصول لـAzure

نحتاج في البداية لحصول على وصول لخدمات Azure عن طريق كتابة هذا الأمر في الـCloud Shell الخاص بـAzure 

![Cloud Shell](/media/screen-shot-2020-05-03-at-9.23.21-pm.png "Cloud Shell")

أنسخ الأمر التالي مع مراعات تغيير مايلزم

```
az ad sp create-for-rbac --name "myApp" --role contributor --scopes /subscriptions/<subscription-id>/resourceGroups/<group-name>/providers/Microsoft.Web/sites/<app-name> --sdk-auth
```

سيقوم بإنتاج json object هو مفتاح الوصول لخدمات Azure على الـ Resource Group المحدد (قم بنسخة ستحتاجه لاحقاً)

من ثم الذهاب الى Github Repository > Settings > Secrets > Add New Secret

قم بإضافة مفتاح جديد بإسم `AZURE_CREDENTIALS`

قم بلصق مفتاح الوصول الذي تم استخراجة من آجور، سنتمكن بإتباع هذه الطريقة الوصول لخدمات Azure بطريقة آمنة.

## ثانياً: كتابة Action لرفع الملفات لـ Azure

سنستخدم dotnet في العملية التالية، لكن مع بعض التعديلات بإمكانك إستخدام أي إطار عمل آخر ([للمزيد](https://docs.microsoft.com/en-us/azure/app-service/deploy-github-actions))

سنذهب الآن لخانة Actions في الـ Repository ونقوم بإضافة new workflow ستظهر لنا عدة نماذج نستطيع تجربتها لكن في هذه المقالة سنقوم بكتابة الـworkflow الخاص بنا وشرح كل خطوة فيه للتتضح الصور.

```
# 1) the trigger
on:
  push:
    branches:
      - master
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:

    # 2) checkout the repo
    - uses: actions/checkout@master
    
    # 3) login to azure
    - uses: azure/login@v1
      with:
        creds: ${{ secrets.AZURE_CREDENTIALS }}
    
    # 4) Setup the environment
    - name: Setup .NET Core
      uses: actions/setup-dotnet@v1.4.0
      with:
        dotnet-version: 3.1.100 # استبدله بالنسخة الخاصة بك

    
    # 5) dotnet build and publish
    - name: Build with dotnet
      run: dotnet build ./src/GithubActions --configuration Release # مسار المشروع

    - name: dotnet publish
      run: |
            dotnet publish ./src/GithubActions -c Release -o publishedFiles
    - name: 'Run Azure webapp deploy action'
      uses: azure/webapps-deploy@v1
      with: 
        app-name: githubActionsWebApp # استبدله بإسم الـwebApp لديك
        package: ./publishedFiles

    # 6) Azure logout 
    - name: Azure Logout
      run: |
        az logout 
```
```
# 1) the trigger
on:
  push:
    branches:
      - master
```
١. هنا نحدد متى سيعمل الـworkflow ونستطيع تحديدها عند عمل أي push على branch محدد أو على pull requests حسب طبيعة العمل لديك

بعد ذلك سنقوم بتحديد الـbuild agent التي ستقوم بعمل build وdeploy للمشروع لدينا

```
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
```

اخترنا هنا ubuntu آخر اصدار وتحت الـ `steps:` سنحدد العمليات التي سيقوم بها الـworkflow

```
    # checkout the repo
    - uses: actions/checkout@master
```

نستخدم `checkout` لأخذ نسخة من الريبو الحالية لنتمكن من عمل build وpublish 

```
    #login to azure
    - uses: azure/login@v1
      with:
        creds: ${{ secrets.AZURE_CREDENTIALS }}
```

بعد ذلك سنقوم بالتسجيل الدخول لآجور بإستخدام المفتاح الذي سبق وحفظناه في الـSecrests 
```
    - name: Setup .NET Core
      uses: actions/setup-dotnet@v1.4.0
      with:
        dotnet-version: 3.1.100 # استبدله بالنسخة الخاصة بك
```
تحديد نسخة الدوت نت المستخدمة مثل هنا ٣.١ او بإمكانك تحديد أي بيئة تحتاج مثل nodejs أو غيرها

```
    # dotnet build and publish
    - name: Build with dotnet
      run: dotnet build ./src/GithubAction --configuration Release # المسار للمشروع

    - name: dotnet publish
      run: |
            dotnet publish ./src/GithubAction -c Release -o publishFiles
```

الآن قمنا بالتأكد أن المشروع تم بناؤه بدون أخطاء وتستطيع اضافة خطوة إضافية هنا لتشغيل الـ tests لديك للتأكد من سلامة المشروع قبل الرفع (الرجاء مراعاة تغيير مايلزم)

```
    - name: 'Run Azure webapp deploy action'
      uses: azure/webapps-deploy@v1
      with: 
        app-name: githubActionsWebApp # استبدله بإسم الـwebApp لديك
        package: ./publishedFiles
```
في الأمر السابق سيقوم الـ workflow برفع جميع الملفات الجديدة لآجور وتحديث الموقع لديك

## ختاماً
بهذه الخطوات البسيطة سيعمل لديك الـ workflow في كل مره تقوم بعمل push للريبو وتكون طبقت مفهوم الـ CI\CD ووفرت الوقت والأخطاء البشرية :). ولأي سؤال أو إستفسار أنا متواجد على تويتر بإمكانك مراسلتي.
