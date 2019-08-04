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

### المبدأ الثالث: Liskov Substitution Principle

LSP هو المبدأ الثالث من مبادئ SOLID وهو أن يجب أن تكون الـClasses الموروثة (الفرعية) ترث جميع صفات الـClasses التي ترث منها

> subtypes must be substitutable for their base types

ومن أشهر الأمثلة في هذا المبدأ مثال "المستطيل والمربع"، المستطيل يتكون من أربع جوانب وأربع زوايا صحيحة، المربع من الناحية الأخرى لديه أربع جوانب **متساوية** وأربع زوايا صحيحة أيضاً فهندسياً المربع هو مستطيل لكن المستطيل جوانبه مختلفة هنا تظهر قوة مبدأ LSP تقول Baraba Liskov وهي من قام بتقديم هذا المبدأ يجب علينا أن نستبدل مابين علاقة is a الى علاقة is substituation وفي المثال توضح الفكرة أكثر

```csharp
public class Rectangle 
{    
  public virtual int Width { get; set; }    
  public virtual int Height { get; set; }
}

public class AreaCalculator 
{    
  public static int Area(Rectangle rect) 
  {       
    return rect.Width * rect.Height;    
  }
}
```

الان لدينا Class للمستطيل فيه الطول والعرض وClass آخر لحساب المساحة يقوم بضرب الطول في العرض ويرجع لنا الناتج. جميل الآن بما أننا قلنا أن المربع هو مستطيل سنقوم بإنشاء Class للمربع يحمل يرث Class المستطيل

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

هنا نقوم بتغيير بسيط في خصائص Class المربع وهو يجب أن يكون الطول والعرض متساويين ولا لن يكون الشكل مربع سنقوم بعمل override للطول والعرض لضمان أن متى ماتم تغيير قيمة الطول ستتغير قيمة العرض لتكون مساوية لها والعكس صحيح.

الى الآن البرنامج يعمل بشكل صحيح ولا يشكو من أي عله الى أن نصل لهذه المرحلة

```csharp
Rectangle myRect = new Square();
myRect.Width = 10;
myRect.Height = 20;
Console.WriteLine(AreaCalculator.Area(myRect)); // 400
```

في السطر الأول نريد إنشاء Object من نوع مستطيل ولكن قمنا بإنشاء مربع، وأيضاً قمنا بجعل العرض يساوي ١٠ والطول يساوي ٢٠ إذا أردنا حساب المساحة فنحن نتوقع الجواب أن يكون ٢٠٠ وهو حاصل ضرب ١٠ في ٢٠ لكن نتفاجئ أن الجواب ٤٠٠ وهو ناتج ضرب ٢٠ في ٢٠ قام البرنامج بإعادة تعيين العرض عندما قمنا بتغيير الطول وهنا نقع بالمحظور لأن كلما كبر حجم البرنامج الذي تعمل عليه سيكون من الصعب مجاراة مثل هذه المشاكل من الممكن أن تقول هنا واضح أننا اردنا مستطيل لكننا أنشئنا مربع في السطر الأول لكن تخيل أنها Function تستقبل مجموعة مستطيلات والمبرمج أرسل مجموعة مربعات هنا سيأخذ وقت طويل لمعرفة أين الخطأ

ما الحل إذاً؟

يوجد حليين في هذه الحالة الأول نحن نعرف أن المربع يجب أن تكون جوانبه متساويه فمن الممكن أن نضع Property لمعرفة هل هذا الـClass مربع أم مستطيل

```csharp
public class Rectangle 
{    
  public int Width { get; set; }    
  public int Height { get; set; }
  public bool IsSquare => Height == Width;
}
```
والحل الثاني هو فصل Class المستطيل عن Class المربع
```csharp
public class Rectangle 
{    
  public int Width { get; set; }    
  public int Height { get; set; }
}

public class Square 
{    
  public int Side { get; set; }    
}
```

### المبدأ الرابع: Interfaces Segregation Principle
وصلنا للمبدأ الرابع في المجموعة وهو فصل الـInterfaces
>> Clients should not be forced to depend upon interfaces that they do not use.

العملاء -المبرمجين- لا يجب أن يجبرون على إنشاء Functions لا يستخدمونها. بمعنى يجب علينا فصل الـInterfaces لتكون أصغر لتلبي احتياج العميل بدقة. على غرار المبدأ الأول SRP نقوم بفصل الـInterfaces لتقليل الأثار الجانبية والتكرار عن طريق فصل البرنامج لأجزاء صغيرة
```csharp
interface IBirdToy {
  void SetPrice();
  void SetColor();
  void Walk();
  void Fly();
}

class ParrotToy : IBirdToy 
{
  int Price;
  string Color;

  public void SetPrice(double price) 
  {
    this.Price = price;
  }
  
  public void SetColor(string color) 
  {
    this.Color = color;
  }

  public void Move() 
  {
    //Code to move.
  }

  public void Fly()
  {
    //Code to fly
  }
}

class PenguinToy : IBirdToy 
{
  int Price;
  string Color;

  public void SetPrice(double price) 
  {
    this.Price = price;
  }
  
  public void SetColor(string color) 
  {
    this.Color = color;
  }
  
  public void Move() 
  {
    //Code to move.
  }

  public void Fly()
  {
    throw new NotImplementedException();
  }
}
```
تخيل أننا نقوم بعمل نظام لبيع ألعاب طيور مثلاً هنا لدينا Interface تجبر المبرمجين -العملاء- على إنشاء أربع Functions سميناها IBirdToy وعندنا في النظام نوعين من الطيور وهي ببغاء وبطريق، في Class الببغاء إذا نظرنا في المثال أعلاه نستطيع بناء جميع هذه الـFunctions لكن في البطريق نضع في Function الـFly إستثناء من نوع NotImplementedException لأن البطريق لا يطير لكن الـInterface تجربنا على إنشاء هذه الـFunction وهنا نحن ننتهك المبدأ الرابع بأننا نجبر المبرمج على إنشاء Functions لا يستخدمها.

الحل؟
نقوم بفصل الـInterfaceالى ثلاث أقسام تابع المثال
```csharp
interface IBirdToy
{
	void SetPrice();
	void SetColor();
}
interface IWalkable
{
	void Walk();
}
interface IFlyable
{
	void Fly();
}

class ParrotToy : IBirdToy, IWalkable, IFlyable
{
	int Price;
	string Color;
	public void SetPrice(double price)
	{
		this.Price = price;
	}
	public void SetColor(string color)
	{
		this.Color = color;
	}
	public void Move()
	{
		//Code to move.  
	}
	public void Fly()
	{
		//Code to fly  
	}
}

class PenguinToy : IBirdToy, IWalkable
{
	int Price;
	string Color;
	public void SetPrice(double price)
	{
		this.Price = price;
	}
	public void SetColor(string color)
	{
		this.Color = color;
	}
	public void Move()
	{
		//Code to move.  
	}
	public void Fly()
	{
		throw new NotImplementedException();
	}
}
```
في المثال اعلاه فصلنا الـInterfaces الخاصة بالمشي والخاصة بالطيران كل على حده بهذه الطريقة نحن نضمن أن العملاء لن يحتاجون لبناء Functions لا يحتاجونها.

### المبدأ الخامس: Dependency Inversion Principle

هنا الشرح
