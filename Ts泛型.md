### 泛型的运用
##### 泛型+函数
- <T>类似于函数的形参，也是入口，供函数内部使用
```
function identity<T>(arg: T): T {
  return arg;
}
```
##### 泛型+接口
-（<>）括起泛型类型跟在接口名后面，或内部使用泛型  
```
// 形式1：接口属性设置泛型
interface GenericIdentityFn {
  <T>(arg: T): T
}
let myIdentity: GenericIdentityFn = identity;
// 形式2：把泛型参数当作整个接口的一个参数
interface GenericIdentityF1<T> {
  (arg: T): T
}
// 指定了identity函数的泛型参数为string类型
let myIdentity1: GenericIdentityF1<string> = identity;
```  
##### 泛型+类
- 泛型类看上去与泛型接口差不多。 泛型类使用（<>）括起泛型类型，跟在类名后面。
- 类有两部分：静态部分和实例部分。 泛型类指的是实例部分的类型，所以类的静态属性不能使用这个泛型类型。 
```
  class GenericNumber<T> {
    value: T;
    add: (x: T, y: T) => T;
  }
  let myGenericNumber = new GenericNumber<string>();
  myGenericNumber.zeroValue = '34';
  myGenericNumber.add('43', '54')
```  
##### 泛型约束
- 有时我们需要限制传入函数的类型（如带length的数组），传入的类型至少需要包含这一属性，这时可以使用extends关键字实现约束
```
  interface LengthWise {
    length: number;
  }
  function loggingIdentity<T extends LengthWise>(arg: T): T {
    console.log(arg.length);
    return arg;
  }
  loggingIdentity({ a: 43, length: 34 })
```  
### 类型的运用    
##### 类型操作符
 - keyof ：允许我们遍历某种类型的属性，获取该类型的所有键，且返回类型是联合类型。
   ```
     type Point = { x: number, y: boolean };
     type P = keyof Point; // Point

     type Arrayish = { [n: number]: boolean };
     type D = keyof Arrayish; // number

     const obj = { a: 33, b: 4, c: true };
     type O = typeof obj; // 'a' | 'b' | 'c'
   ``` 
 - typeof:用来获取一个变量或对象的类型(注意：其后需为标识符，而非直接值)   
   ```
     type S = typeof 'str';
     const char:S; 
     // 等价于
     const char1:string;
   ```
 - ReturnType<funcType>: 获取函数返回的类型    
   ```
     type Predicate = (x: unknown) => ({ x: number, y: boolean });
     type K = ReturnType<Predicate>;
   ```  
##### 常见的类型用方式
 - 索引访问类型：用类似于js中获取对象或数组属性的方式去访问类型 
   ```
     type Person = { age: number, name: string, alive: boolean };
     // 写法1
     type Age = Person['name']; √
     // 写法2
     type Name = 'name';
     type Age = Person[Name]; √
     // 注意[]里接收的是类型不是值
     const name = 'name'
     type Age = Person[name]; X
     // 联合类型的键
     type I1 = Person["age" | "name"];
     const myArr = [
       { a: 'a', b: 'b' },
       { a: 'a', b: true, c: [4, 3] },
       { a: 4, b: 'bob' },
     ]
     // 遍历数组并获取每一项的类型的合集，然后得到他们的联合类型。
     type TotalType = typeof myArr[number]
     // 索引某项的a属性的联合类型
     type SingleType = typeof myArr[number]['a']
   ```
  - 条件类型：类似于js中三元运算符的方式获取类型 
   ```
     // 简单应用
     type Example1 = number extends any ? number : string; // number
     type Example2 = RegExp extends Object ? boolean : string[]; // boolean
     // 复杂应用
     type MessageOf<T extends { message: unknown }> = T["message"];
     interface Email {
       message: string;
     }
     type EmailMessageContents = MessageOf<Email>;
     // 约束移出并引入条件类型
     type Message<T> = T extends { msg: string } ? T['msg'] : never;
     type EmailMsgContents = Message<Email>
     // 将数组类型扁平化为其元素类型
     type Flatten<T> = T extends any[] ? T[number] : never;
     const mulArr = [4, 'a', true];
     type Str = Flatten<typeof mulArr>
     // 用infer关键字进行类型推断,替代T[number]
     type Flatten<T> = T extends Array<infer Item> ? Item : T;
     // infer 将推断的类型赋给自定义的类型别名Return
     type GetReturnType<T> = T extends (...args: never[]) => infer temp ? temp : never;
     type Num = GetReturnType<() => number>; // number(temp)
     // 分布条件类型
     // 如果我们将联合类型插入ToArray，则条件类型将应用于该联合的每个成员。
     type ToArray<T> = T extends any ? T[] : never;
     type Combine = ToArray<string | number> // string[] | number[]
     const combineValue:Combine = [43,5]; //单项值类型较为单一
    
     type ToArr<T> = [T] extends [any] ? T[] : never; // 用方括号包裹类型
     type CombineArr = ToArr<string | number>; // (string | number)[]
     const combineUnionArr:CombineArr = [43,'434'] // 类似于元组，数组项可为多种类型值
   ``` 
  - 映射类型：映射类型构建在索引签名的语法之上。
   ```
     type OptionsFlags<Type> = {
       [Property in keyof Type]: boolean;
     };
     type FeatureFlags = {
       darkMode: () => void;
       newUserProfile: () => void;
     };
     type FeatureOptions = OptionsFlags<FeatureFlags>;
   ```
### 小结
 - ts中的泛型类似于js中的函数形参，在使用时只需要传入相应类型即可
 - ts中的各种类型的访问和操作方式，类似于js中的常见的赋值、三元运算、对象及数组的索引和遍历等操作。   
