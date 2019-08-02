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

المبدأ الأول مبني على قاعدة أساسية وهي في حالة كتابتك أي Class يجب أن يكون له سبب واحد للتغيير ومهمة واحدة يعمل لها. كأن أن لا يكون لديك Employee Class يحفظ معلومات الموظف ويقوم بالإتصال بقاعدة البيانات مثلاً هنا يجب أن تفصل مابين هذه المهمتين.

> > A class should have one and only one reason to change, meaning that a class should have only one job.

### المبدأ الثاني: Open/Closed Principle

المبدأ الثاني بكل بساطة معناه أن يكون الـClass قابل لتمدد بدون مايتم التعديل على الـClass نفسه

> > Objects or entities should be open for extension, but closed for modification.

فمثلاً لدينا Class مستطيل لديه متغيرين طول وعرض وClass آخر يقوم بحساب المساحة من خلال تمرير مصفوفة من المستطيلات 

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
            area += shape.Width * shape.Height;
        }

        return area;
    }
}
```

الى هنا النظام يعمل بشكل صحيح الى أن تتغير المتطلبات والآن نريد أن نضيف أيضا شكل الدائرة ونريد ان نقوم بحساب مساحتها أيضاً وجميعاً يعرف أن طريقة حساب مساحة الدائرة يختلف عن المستطيل الحل السريع أن نضع IF Statement في دالة Area كما في المثال لنعرف إذا كانت المصفوفة مستطيل أو دائرة وفي كل مره تتغير المتطلبات أو نريد اضافة شكل جديد سنقوم بتغيير بإضافة IF جديدة وهلماً جرى وهنا نحن نكسر مبدأ Open for extention and Closed for modification 

```csharp
public double Area(object[] shapes)
{
    double area = 0;
    foreach (var shape in shapes)
    {
        if (shape is Rectangle)
        {
            Rectangle rectangle = (Rectangle) shape;
            area += rectangle.Width * rectangle.Height;
        }
        else
        {
            Circle circle = (Circle)shape;
            area += circle.Radius * circle.Radius * Math.PI;
        }
    }

    return area;
}
```

ماهو الحل إذا؟

الحل أن نقوم بإنشاء Abstract Class Shape ونجعل جميع الأشكال لدينا وهي المستطيل والدائرة ترث منه (Inheritance) ليجبرون على إنشاء دالة Area التي سوف نستخدمها في حساب المساحة وكل شكل هنا سنقوم بكتابة طريقة حساب مساحته عند إنشاءه

```csharp
public abstract class Shape
{
    public abstract double Area();
}
public class Rectangle : Shape
{
    public double Width { get; set; }
    public double Height { get; set; }
    public override double Area()
    {
        return Width * Height;
    }
}
public class Circle : Shape
{
    public double Radius { get; set; }
    public override double Area()
    {
        return Radius * Radius * Math.PI;
    }
}
```

رائع! الآن نستطيع حساب مساحة مجموع الأشكال التي لدينا وحتى لو اضفنا شكل جديد من دون الحاجة للتعديل على Class AreaCalculator لأن في كل شكل لدينا نحن نضمن أن هناك دالة لحساب مساحته وهي دالة Area 

```csharp
public double Area(Shape[] shapes)
{
    double area = 0;
    foreach (var shape in shapes)
    {
        area += shape.Area();
    }
    return area;
}
```

### المبدئ الثالث: Liskov Substitution Principle

LSP هو المبدأ الثالث من مبادئ SOLID وهو أن يجب أن تكون الـClasses الموروثة (الفرعية) ترث جميع صفات الـClasses التي ترث منها

> subtypes must be substitutable for their base types

ومن أشهر الأمثلة في هذا المبدأ، المستطيل يتكون من أربع جوانب وأربع زوايا صحيحة، المربع من الناحية الأخرى لديه أربع جوانب **متساوية** وأربع زوايا صحيحة أيضاً فهندسياً المربع هو مستطيل لكن المستطيل جوانبه مختلفة هنا تظهر قوة مبدأ LSP تقول Baraba Liskov وهي من قام بتقديم هذا المبدأ يجب علينا أن نستبدل مابين علاقة is a الى علاقة is substituation وفي المثال توضح الفكرة أكثر

```csharp
public class Rectangle {    
  public virtual int Width { get; set; }    
  public virtual int Height { get; set; }
}
public class AreaCalculator {    
  public static int Area(Rectangle rect) {       
    return rect.Width * rect.Height;    
  }
}
```

الان لدينا Class للمستطيل فيه الطول والعرض وClass آخر لحساب المساحة يقوم بضرب الطول في العرض ويرجع لنا الناتج. جميل الآن بما أننا قلنا أن المربع هو مستطيل سنقوم بإنشاء Class للمربع يحمل يرث صفات المستطيل

```csharp
public class Square : Rectangle 
{    
  private int _height;    
  public override int Height     
  {        
    get { return _height; }        
    set         
    {            
      _width = value;            
      _height = value;        
    }    
  }    
  private int _width;    
  public override int Width     
  {        
    get { return _width; }        
    set         
    {            
      _width = value;            
      _height = value;        
    }    
  }
}
```

هنا نقوم بتغيير بسيط في الطول والعرض وهو يجب أن يكون الطول مساوي للعرض والعكس صحيح ولا لن يكون الشكل مربع قمنا بعمل override للطول والعرض لضمان أن متى ماغيرنا قيمة الطول ستتغير قيمة العرض يتكون مساوية لها والعكس صحيح.

الى الآن البرنامج يعمل بشكل صحيح ولا يشكو من أي عله الى أن نصل لهذه المرحلة

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
