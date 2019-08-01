---
template: post
title: مبادئ SOLID في الـObject Oriented
slug: /posts/solid-principles/
draft: false
date: '2019-07-30T22:40:32.169Z'
description: هنا سيتم كتابة وصف للمقالة
category: برمجة
tags:
  - برمجة
  - تقنية
---
* [المقدمة](#مقدمة)
* [ماهي الفائدة؟](#ماهي-الفائدة-من-هذه-المبادئ؟)

## مقدمة

**S.O.L.I.D.** هي أختصار لخمسة مبادئ أساسية عندما تقوم ببرمجة بإستخدام الـObject Oriented

1. Single Responsibility Principle
2. Open\Closed Principle
3. Liskov Substitution Principle
4. Interfaces Segregation Principle
5. Dependency Inversion Principle

قام [Robert C. Martin](https://en.wikipedia.org/wiki/Robert_C._Martin) المعروف بـ Uncle Bob بتقديمها لأول مره في رسالته "Design Principles and Design Patterns"

### ماهي الفائدة من هذه المبادئ؟
عندما تقوم ببرمجة وفقاً لهذه المبادئ سيكون لديك برنامج أبسط في الفهم لك وللمبرمجين الآخرين، أسهل في الصيانة، وقابل للتوسع. وسنعرف لاحقاً كيف يكون تطبيق هذه المبادئ يساعد في تحقيق ماذكر.

### المبدأ الأول: Single Responsibility Principle
المبدأ الأول مبني على قاعدة أساسية وهي في حالة كتابتك أي نص برمجي يجب أن يكون له سبب واحد للتغيير ومهمة واحدة يعمل لها.
>> A class should have one and only one reason to change, meaning that a class should have only one job.

### المبدأ الثاني: Open/Closed Principle

المبدأ الثاني بكل بساطة معناه أن يكون الـClass قابل لتمدد بدون مايتم التعديل على الـClass نفسه

>> Objects or entities should be open for extension, but closed for modification.

من أشهر الأمثلة على هذا المبدأ هو AreaCalculator للـShapes.
أحرص دائماً على كتابة Class فيه المتطلبات الأساسية له وأترك الباقي يتولى أمره من سيقوم بوراثته Inheritance 
```csharp
public class Rectangle
{
    public double Width { get; set; }
    public double Height { get; set; }
}
public class AreaCalculator
{
    public double Area(Rectangle[] shapes)
    {
        double area = 0;
        foreach (var shape in shapes)
        {
            area += shape.Width*shape.Height;
        }

        return area;
    }
}
```


### المبدئ الثالث: Liskov Substitution Principle

هنا الشرح

### المبدئ الرابع: Interfaces Segregation Principle

هنا الشرح

### المبدئ الخامس: Dependency Inversion Principle

هنا الشرح

![42-line-bible.jpg](/media/42-line-bible.jpg)
_The 42–Line Bible, printed by Gutenberg._

<figure>
	<blockquote>
		<p>Knowledge of the quality of a typeface is of the greatest importance for the functional, aesthetic and psychological effect.</p>
		<footer>
			<cite>— Josef Mueller-Brockmann</cite>
		</footer>
	</blockquote>
</figure>

> Humane typography will often be comparatively rough and even uncouth; but while a certain uncouthness does not seriously matter in humane works, uncouthness has no excuse whatever in the productions of the machine.
>
> — Eric Gill
