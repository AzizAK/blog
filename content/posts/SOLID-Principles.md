---
template: post
title: مقدمة في مبادئ SOLID وكيف تبني كود نظيف
slug: /posts/solid-principles/
draft: false
date: 2019-08-05T11:40:32.169Z
description: هنا سيتم كتابة وصف للمقالة
category: برمجة
tags:
  - برمجة
  - تقنية
---
* [المقدمة](#مقدمة)
* [ماهي الفائدة؟](#ماهي-الفائدة-من-هذه-المبادئ؟)
* [في الختام](#في-الختام)

## مقدمة

كلمة S.O.L.I.D هي اختصار لخمسة مبادئ أساسية في برمجة الـObject Oriented 

1. Single Responsibility Principle
2. Open\Closed Principle
3. Liskov Substitution Principle
4. Interfaces Segregation Principle
5. Dependency Inversion Principle

مبادئ SOLID تعتبر معايير للبرمجة كما انه تقودك اذا طبقتها بشكل سليم الى كتابة كود نظيف (Clean Code)، تم تقديمها لأول مره بواسطة [Robert C. Martin](https://en.wikipedia.org/wiki/Robert_C._Martin) المعروف بـإسم Uncle Bob في رسالته "Design Principles and Design Patterns".

### ماهي الفائدة من هذه المبادئ؟

عندما يقوم المبرمج بكتابة برنامج من دون اتباع معايير معيينه ينتج الى ذلك تصميم سيء للبرنامج مما يؤدي الى برنامج غير قابل للتوسع ومليء بالاخطاء البرمجية عند قيامك بأي تعديل لاحقاً، ولكن عندما تقوم ببرمجة وفقاً لهذه المبادئ سيكون لديك برنامج أبسط في الفهم لك وللمبرمجين الآخرين، أسهل في الصيانة، وقابل للتوسع. وسنعرف الان كيف يكون تطبيق هذه المبادئ يساعد في تحقيق ماذكر. مع أمثلة تطبيقية لذلك بإستخدام لغة #C لكنها تنبطق على أي لغة Object Oriented.

### المبدأ الأول: Single Responsibility Principle

المبدأ الأول هو مبدأ المسؤولية الواحدة لكل جزء من البرنامج سواء كان Class او Functions

> Each software module should have one and only one reason to change, meaning that a module should have only one job.

أي وحده برمجية مثل Class أو Function وغيرها يجب أن يكون لها سبب واحد للتعديل بمعنى أنه يجب انه تحقق مهمة واحدة فقط
وهنا مثال بسيط يوضح المبدأ وكيف تطبيقة
```csharp
public class InvitationService
{
	public void SendInvite(string email, string firstName, string lastName)
    {
    	if(String.IsNullOrWhiteSpace(firstName) || String.IsNullOrWhiteSpace(lastName))
        {
         	throw new Exception("Name is not valid!");
        }
    	
    	if(!email.Contains("@") || !email.Contains("."))
        {
        	throw new Exception("Email is not valid!!");
        }

        SmtpClient client = new SmtpClient();
        client.Send(new MailMessage("yourEmail@kharashi.me", email)
        {
            Subject = "Hello World"
        });
    }
}
```
لنقل أننا نريد أن نبني خدمة لإرسال دعوات للمستخدمين مثلاً. في المثال دالة SendInvite تقوم بإرسال الدعوة لكن قبل ذلك تقوم بالتحقق من أن الأسم الأول والثاني موجودين وأيضاً تقوم بالتحقق من صحة كتابة البريد الإلكتروني. هنا في هذه الدالة لو أردنا ان نقوم بتغيير بسيط بقوانين التحقق سنقوم بإعادة كتابة الدالة وهي ليست من مهامها وأيضاً ستكون أكثر تعقيدناً. ببساطة لأن لها أكثر من سبب للتغيير مثل التحقق للبريد الاكتروني او الاسم الاول او حتى تغيير طريقة ارسال الدعوات.

حسناً كيف يمكننا كتابة الكود بطريقة جيدة تتماشى مع مبدأ SRP؟
```csharp
public class UserNameService
{
    public void Validate(string firstName, string lastName)
    {
        if(String.IsNullOrWhiteSpace(firstName) || String.IsNullOrWhiteSpace(lastName))
        {
            throw new Exception("The name is invalid!");
        }
    }
}
```

وأيضاً سنقوم بفصل التحقق من صحة البريد الإلكتروني لـClass أخر خاص به.

```csharp
public class EmailService
{
    public void Validate(string email)
    {
        if (!email.Contains("@") || !email.Contains("."))
        {
            throw new Exception("Email is not valid!!");
        }
    }
}
```

بعد ذلك ستكون دالة SendInvite كالتالي

```csharp
public class InvitationService
{
    UserNameService _userNameService;
    EmailService _emailService;

    public InvitationService(UserNameService userNameService, EmailService emailService)
    {
        _userNameService = userNameService;
        _emailService = emailService;
    }
    public void SendInvite(string email, string firstName, string lastName)
    {
        _userNameService.Validate(firstName, lastName);
        _emailService.Validate(email);
        SmtpClient client = new SmtpClient();
        client.Send(new MailMessage("yourEmail@kharashi.me", email)
        {
            Subject = "Hello World"
        });
    }
}
```

الآن لو تلاحظ كل Class من الذي كتبناها له سبب واحد للتغيير اذ اردنا تغيير طريقة التحقق من صحة البريد الإلكتروني سنقوم بتغيير EmailService فقط من دون الذهاب وتغيير دالة SendInvite 

### المبدأ الثاني: Open/Closed Principle

المبدأ الثاني بكل بساطة معناه أن يكون الـClass قابل لتمدد بدون مايتم التعديل على الـClass نفسه

> Objects or entities should be open for extension, but closed for modification.

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

الحل أن نقوم بإنشاء Abstract Class Shape ونجعل جميع الأشكال لدينا وهي المستطيل والدائرة ترث منه (Inheritance) ليجبرون على إنشاء دالة Area التي سوف نستخدمها في حساب المساحة وكل شكل هنا سنقوم بكتابة طريقة حساب مساحته الخاص به عند إنشاءه.

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

رائع! الآن نستطيع حساب مساحة مجموع الأشكال التي لدينا وحتى لو اضفنا شكل جديد من دون الحاجة للتعديل على Class AreaCalculator لأن في كل شكل لدينا نحن نضمن أن هناك دالة لحساب مساحته وهي دالة Area.

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
وبهذه الطريقة نحن نحقق المبدأ الثاني بأننا نستطيع التوسع بالـClass ومن دون الحاجة لتعديله.

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
Console.WriteLine(AreaCalculator.Area(myRect)); 
// 400
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

> > Clients should not be forced to depend upon interfaces that they do not use.

العملاء -المبرمجين- لا يجب أن يجبرون على إنشاء Functions لا يستخدمونها. بمعنى يجب علينا فصل الـInterfaces لتكون أصغر لتلبي احتياج العميل بدقة. على غرار المبدأ الأول SRP نقوم بفصل الـInterfaces لتقليل الأثار الجانبية والتكرار عن طريق فصل البرنامج لأجزاء صغيرة.

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

  public void Walk()
  {
    //Code to walk.
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

  public void Walk()
  {
    //Code to walk.
  }

  public void Fly()
  {
    throw new NotImplementedException();
  }
}
```

تخيل أننا نقوم بعمل نظام لبيع ألعاب الطيور مثلاً -مثال غريب لكن يوضح الصورة :)- هنا لدينا Interface تجبر المبرمجين -العملاء- على إنشاء أربع Functions سميناها IBirdToy وعندنا في النظام نوعين من الطيور وهي ببغاء وبطريق، في Class الببغاء إذا نظرنا في المثال أعلاه نستطيع بناء جميع هذه الـFunctions لكن في البطريق نضع في Function الـFly إستثناء من نوع NotImplementedException لأن البطريق لا يطير لكن الـInterface تجربنا على إنشاء هذه الـFunction وهنا نحن ننتهك المبدأ الرابع بأننا نجبر المبرمج على إنشاء Functions لا يستخدمها.

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
	public void Walk()
	{
		//Code to walk.
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
	public void Walk()
	{
		//Code to walk.
	}
}
```

في المثال اعلاه فصلنا الـInterfaces الخاصة بالمشي والخاصة بالطيران كل على حده بهذه الطريقة نحن نضمن أن العملاء لن يضطرون لبناء Functions لا يحتاجونها.

### المبدأ الخامس: Dependency Inversion Principle

يهتم هذا المبدأ في المقام الأول بتقليل التبعيات (dependencies) بين وحدات الكود. يمكننا التفكير في الأمر على أنه يحتاج إلى low-level objects لتعريف العقود -مثل Interface- التي يمكن أن تستخدمها high-level objects، دون الحاجة إلى أن تهتم بالتنفيذ بالضبط الذي توفره low-level objects.

> High-level modules should not depend on low-level modules. Both should depend on abstractions. Abstractions should not depend on details. Details should depend on abstractions.

وفي المثال سنقوم بشرح ما المقصود بالـlow-level و high-level ومثال على طريقة تحقيق هذا المبدأ.

لنفترض أننا سنقوم ببناء نظام لإرسال تنبيهات للعملاء ونريد أن نرسل التنبيهات عن طريق الـEmail والـSMS

```csharp
public class Email
{
  public string ToAddress { get; set; }
  public string Subject { get; set; }
  public string Content { get; set; }
  public void SendEmail() {
    //Send email implementation
  }
}
public class SMS
{
  public string PhoneNumber { get; set; }
  public string Message { get; set; }
  public void SendSMS()
  {
    //Send sms implementation
  }
}

public class Notification
{
  private Email _email;
  private SMS _sms;
  public Notification()
  {
    _email = new Email();
    _sms = new SMS();
  }
  public void Send()
  {
    _email.SendEmail();
    _sms.SendSMS();
  }
}
```

في هذه الحالة Class Notification يعتبر high-level يعتمد على Email Class و SMS Class وبهذه الحالة هم يعتبرون low-level. في المثال اعلاه نحن ننتهك مبدأ DIP بإعتماد Class Notification على Email وSMS مباشرة من دون الفصل بينهما. وبهذا الفعل نحن نجعل الكود مقترن بعضه ببعض بطريقة تجعل من الصعب التعديل عليه مستقبلاً ولو تلاحظ تركز جميع المبادئ على تقليل الاعتمادية في الكود ببعضه البعض.

حسناً كيف يمكننا تحقيق مبدأ DIP؟
سنجعل الـhigh level class يعتمد على interface وسنجعل الـlow-level class التي لدينا نقوم بإنشاء هذه الـinterface. تابع المثال

```csharp
public interface IMessage
{
  void SendMessage();
}
```

الآن سنجعل جميعاً الـEmail class وSMS class يقومون بإنشاء Function اسمها SendMessage

```csharp
public class Email : IMessage
{
  public string ToAddress { get; set; }
  public string Subject { get; set; }
  public string Content { get; set; }
  public void SendMessage()
  {
    //Send email
  }
}

public class SMS : IMessage
{
  public string PhoneNumber { get; set; }
  public string Message { get; set; }
  public void SendMessage()
  {
    //Send sms
  }
}
```

وفي الأخير مثل ماسبق وقلنا سنجعل الـNotification Class يعتمد على هذه الـInterface أيضاً. تابع

```csharp
public class Notification
{
  private ICollection<IMessage> _messages;
  public Notification(ICollection<IMessage> messages)
  {
    this._messages = messages;
  }
  public void Send()
  {
    foreach(var message in _messages)
    {
      message.SendMessage();
    }
  }
}
```

وبهذا التعديل في الكود جعلنا الـhigh level classes لا تعتمد على الـlow-level classes جميعهم يعتمدون على الـinterface التي بينهم.

### في الختام

ستبدو هذه المبادئ الخمسة صعبة التطبيق في البداية لكن من خلال الممارسة ستتعتاد ومن خلال تطبيقها ستحصد ثمارها في حال كبر حجم البرنامج لديك لانه سيكون قابل لإعادة الاستخدام وقابل للصيانة وقابل للاختبار بسهولة.
