---
title: "State management in SwiftUI"
date: "2026-01-21"
tags: ["ios", "swiftui"]
summary: "A clear wrap-up of its many property wrappers, what to use when."
---

## Chronology of SwiftUI state management 

SwiftUI was first introduced in 2019 with iOS 13 and had a handful of property wrappers already. Things though moved at a faster pace than is actually ideal, and about every year saw newer property wrappers, protocols, modifiers and (soon enough) macros being introduced. And while this happened, even some of the existing interface started getting 'enhancements' in their behavior. Gradually, some of the older interface started getting discouraged in newer WWDC talks but that still didn't get articulated clearly in the documentation.  

As of now, ostensibly here is how expansive the interface is if you were to take the trouble of looking at the full canon.

| Interface                                                    | Introduced (iOS / Year) | Recommended Still?                     |
| ------------------------------------------------------------ | ----------------------- | -------------------------------------- |
| [`@State`](https://developer.apple.com/documentation/swiftui/state) | iOS 13 (2019)           | Yes                                    |
| [`@Binding`](https://developer.apple.com/documentation/swiftui/binding) | iOS 13 (2019)           | May seem unclear, but Yes              |
| [`@Environment`](https://developer.apple.com/documentation/swiftui/environment) | iOS 13 (2019)           | Yes                                    |
| [`@EnvironmentObject`](https://developer.apple.com/documentation/swiftui/environmentobject) | iOS 13 (2019)           | No (legacy directionally since iOS 17) |
| [`@ObservedObject`](https://developer.apple.com/documentation/swiftui/observedobject) | iOS 13 (2019)           | No (legacy directionally since iOS 17) |
| [`ObservableObject`](https://developer.apple.com/documentation/combine/observableobject) protocol | iOS 13 (2019)           | No (legacy directionally since iOS 17) |
| [`.environmentObject()`](https://developer.apple.com/documentation/swiftui/view/environmentobject(_:)) | iOS 13 (2019)           | No (legacy directionally since iOS 17) |
| [`.preference()`](https://developer.apple.com/documentation/swiftui/view/preference(key:value:)) | iOS 13 (2019)           | Yes                                    |
| [`@StateObject`](https://developer.apple.com/documentation/swiftui/stateobject) | iOS 14 (2020)           | No (legacy directionally since iOS 17) |
| [`Observable`](https://developer.apple.com/documentation/observation/observable) protocol | iOS 17 (2023)           | Yes                                    |
| [`@Observable`](https://developer.apple.com/documentation/Observation/Observable) macro | iOS 17 (2023)           | Yes                                    |
| [`@Bindable`](https://developer.apple.com/documentation/swiftui/bindable) | iOS 17 (2023)           | Yes                                    |
| [`@Entry`](https://developer.apple.com/documentation/swiftui/entry()) macro | iOS 17 (2023)           | Yes                                    |

## Why this post

All in all, this entire set of interface has been bit of a clustered mess. While the interface has stabilized appreciably 2023 onwards with iOS 17, in my opinion its not been documented very clearly still. Take for example, this decision tree that was shown in the definitve WWDC 2023 talk [Discover Observation in SwiftUI](https://developer.apple.com/videos/play/wwdc2023/10149/). 

![](/SwiftUI-WWDC2023.png)

And even this isn't fully accurate or comprehensive. For instance what happens if the data I am interested in is a value type, will `@Bindable` work still? The above decision tree is likely only for reference types, but it should have been spelled out. The goal of this post is to give a different decision tree, one that is more accurate.

## A Better Diagram

I have sketched this diagram based on my understanding, and this holds up better as of now (i.e. early 2026/iOS 26).

![](/SwiftUI-Gist-2025.png)

While the diagram is mostly self-explanatory, if you want there is a [companion project](https://github.com/AnandKumar9/SwiftUI-StateAndDataManagement/tree/main) available in my GitHub and it has code snippets showing various facets of this diagram. Some of the nuances though are specifically mentioned below.

### 1. You don't need any property wrapper if you just want to track changes

If there is a child view that just needs to track some `@State` property in its parent and update the UI but not make any changes to the property itself, it does not need a `@Binding ` or any other property wrapper. Just a plain `let` declaration will suffice, its just that the parent view's state's type should be marked with `@Observable` macro if its a reference type. 

The source of truth should be declared as `@State`, if its a value type that is sufficient but if its a reference type then the reference type *must have* `@Observable` macro attached to it.

If the child view property needs to just track changes to a property in its parent view, it can simply be a `let`. If however it has to modify the property in the parent view too that is when it needs a property wrapper,  a `@Binding var` if its a value type, and a `@Bindable var` if its a reference type.

```
struct ParentView: View {
    @State var temperature = 20
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Parent Weather - \(temperature)")            
            Button("Increment from parent") {
                temperature += 1
            }            
            ChildView(temperature: temperature)
        }
    }
}

struct ChildView: View {
    let temperature: Int     // <---- No property wrapper needed here
    
    var body: some View {
        VStack(alignment: .leading) {
            Text("Weather as seen by Child - \(temperature)")
        }
    }
}
```

### 2. @Bindable will not do for value types

Apple's WWDC 2023 diagram (shown above) plainly states that if a child needs a binding to its parent, it can use `@Bindable var`. What it does not spell out is `@Bindable` will build only if the data is of a reference type. If its of a value type, you have to use `@Binding` instead.

```
struct ParentView_ValueTypeData: View {
    @State var temperature = 20
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Parent Weather - \(temperature)"
            ChildView(temperature: $temperature)
        }
    }
}

struct ChildView: View {
    @Binding var temperature: Int     // <---- @Bindable will not compile here
    
    var body: some View {
        VStack(alignment: .leading) {
            Text("Weather as seen by Child - \(temperature)")
            Button("Increment from child") {
                temperature += 1
            }
        }
    }
}
```



### 3. Why you should not use @Binding with reference types

If you are dealing with a reference type its common knowledge that you can attach the `@Observable` macro to that reference type's declaration, and use `@Bindable` in the child view, and it will work. The trap though is that if you were to use `@Binding` instead of `@Bindable` even that will work and you could be tempted to simplify things and just always use `@Binding` (after all it even works with value types whereas `@Bindable` clearly does not).

Here is why you should not do that. If you were to use `@Binding` on reference types, from the child you could even change the source of truth residing in the parent altogether. That is not what is typically needed, and is an unsafe coding practice. From a child you usually want to be able to tweak the properties in a reference type instance, not the instance itself!

```
@Observable
class SampleReferenceType {
    var temperature: Int
    
    init(temperature: Int) {
        self.temperature = temperature
    }
}

struct ParentView_ReferenceTypeData: View {
    @State var data = SampleReferenceType(temperature: 20)
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Parent Weather - \(temperature)"            
            Button("Increment from parent") {
                data.temperature += 1
            }
            ChildView(data: data)
        }
    }
}

struct ChildViewThatNeedsToUpdateToo_ReferenceTypeData: View {
    @Bindable var data: SampleReferenceType
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Weather as seen by Child - \(data.temperature)")
            
            Button("Child increments") {
                data.temperature += 1
                /*
                    ---- Here is why ----
                    @Bindable will thankfully give you a compilation error
                    @Binding whereas would have let you dangerously continue
                    data = NewReferenceType(temperature: 35)
                 */
            }
        }
    }
}
```

## Conclusion

Indeed, the property wrappers you now need are - `@State`, `@Bindable`, `@Environment`, but in some select cases `@Binding` is needed still. These property wrappers aside, `@Observable` and `@Entry` are two macros that are essential. And sometimes you don't even need a property wrapper.

I hope this diagram makes it easier for you to grok and remember things.
