#### ts的常见工具函数
##### in
- in 用来遍历枚举类型
```typescript
type Keys = "a" | "b" | "c"
type Obj =  {
 [p in Keys]: any
} 
// -> { a: any, b: any, c: any }
```
##### Pick
- 将某个类型中的子属性挑出来，变成包含这个类型部分属性的子类型。  
```typescript
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
// 示例
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = Pick<Todo, "title" | "completed">;

const todo: TodoPreview = {
  title: "Clean room",
  completed: false
};
```  
##### Exclude
- 将某个类型中属于另一个的类型移除掉 
```typescript
type Exclude<T, U> = T extends U ? never : T;
// 示例
type T0 = Exclude<"a" | "b" | "c", "a">; // "b" | "c"
type T1 = Exclude<"a" | "b" | "c", "a" | "b">; // "c"
type T2 = Exclude<string | number | (() => void), Function>; // string | number
```  
##### Extract
- 是从 T 中提取出 U，与Exclude相反
```typescript
type Extract<T, U> = T extends U ? T : never;
```
##### Omit
- 使用 T 类型中除了 K 类型的所有属性，来构造一个新的类型
```typescript
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
// 示例
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = Omit<Todo, "description">;

const todo: TodoPreview = {
  title: "Clean room",
  completed: false
};
```    
