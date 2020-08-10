---
template: post
title: رفع موقع الكتروني لـ Azure بإستخدام Github Actions
slug: azureWithActions
draft: false
date: 2020-05-03T04:31:28.540Z
description: 'كيف تربط نظامك في Github مع Azure بواسطة Github Actions '
category: تقنية،برمجة
tags:
  - تقنية، برمجية، CI\CD
---
في شهر أغسطس ٢٠١٩م تم الإعلان عن github actions إذا ما سمعت عنها سابقاً فهي خدمة تقوم بعمل الأعمال المتكررة عوضاً عنك ومنها continuous integration و continuous deployment أو التي تعرف بإختصار CI\CD

سنشرح في هذه المقالة طريقة رفع موقع الكتروني يعمل على dotnet core لخدمات Azure السحابية بإستخدام github actions كما يمكنك رفع أي تطبيق آخر مثل node أو غيره و سأرفق آخر المقالة بعض المراجع التي بإمكانك الإستفادة منها.

## متطلبات سابقة:

1. حساب في Azure و Web App
2. Github Repository

## أولاً: الحصول على مفاتيح الوصول لـ Azure

نحتاج في البداية الحصول على مفتاح الوصول لخدمات Azure عن طريق كتابة هذا الأمر في الـ Cloud Shell الخاص بـ Azure 

![Cloud Shell](/media/screen-shot-2020-05-03-at-9.23.21-pm.png "Cloud Shell")

انسخ الأمر التالي مع مراعات تغيير مايلزم

```
az ad sp create-for-rbac --name "myApp" --role contributor --scopes /subscriptions/<subscription-id>/resourceGroups/<group-name>/providers/Microsoft.Web/sites/<app-name> --sdk-auth
```

سيقوم بإنتاج json object هو مفتاح الوصول لخدمات Azure على الـ Resource Group المحدد (قم بنسخه ستحتاجه لاحقاً)

من ثم الذهاب إلى Github Repository > Settings > Secrets > Add New Secret

قم بإضافة مفتاح جديد بإسم `AZURE_CREDENTIALS`

ألصق مفتاح الوصول الذي تم استخراجه من آجور، بإتباع ما سبق سنتمكن من الوصول لخدمات Azure بطريقة آمنة لاحقاً.

## ثانياً: كتابة Action لرفع الملفات لـ Azure

سنستخدم dotnet في العملية التالية، لكن مع بعض التعديلات بإمكانك إستخدام أي إطار عمل آخر ([للمزيد](https://docs.microsoft.com/en-us/azure/app-service/deploy-github-actions))

سننتقل الآن إلى خانة Actions في الـ Repository ونضيف new workflow. ستظهر لنا عدة نماذج نستطيع تجربتها لكن في هذه المقالة سنكتب الـ workflow الخاص بنا ونشرح كل خطوة فيه للتتضح الصور.

![actions](/media/gotoactions.gif "actions")

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

هنا نحدد متى سيعمل الـworkflow ونستطيع تحديدها عند عمل أي push على branch محدد أو على pull requests حسب طبيعة العمل لديك

بعد ذلك سنحدد الـbuild agent التي ستقوم بعمل build وdeploy للمشروع لدينا

```
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
```

اخترنا هنا ubuntu آخر إصدار وتحت الـ `steps:` سنحدد العمليات التي سيقوم بها الـworkflow

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

بعد ذلك سنقوم بتسجيل الدخول في آجور بإستخدام المفتاح الذي سبق وحفظناه في الـSecrests 

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

الآن قمنا بالتأكد أن المشروع تم بناؤه بدون أخطاء وتستطيع إضافة خطوة إضافية هنا لتشغيل الـ tests لديك للتأكد من سلامة المشروع قبل الرفع (الرجاء مراعاة تغيير مايلزم)

```
    - name: 'Run Azure webapp deploy action'
      uses: azure/webapps-deploy@v1
      with: 
        app-name: githubActionsWebApp # استبدله بإسم الـwebApp لديك
        package: ./publishedFiles
```

في الأمر السابق سيقوم الـ workflow برفع جميع الملفات الجديدة لآجور وتحديث الموقع لديك

## ختاماً

بهذه الخطوات البسيطة سيعمل لديك الـ workflow في كل مره تقوم push للريبو وتكون طبقت مفهوم الـ CI\CD ووفرت الوقت والجهد :). في حال كان لديك سؤال أو استفسار يمكنك التواصل معي عبر تويتر.
