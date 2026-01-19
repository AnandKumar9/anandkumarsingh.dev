---
title: "State management in SwiftUI"
date: "2026-01-18"
tags: ["ios", "swiftui"]
summary: "A clear wrap-up of its many property wrappers, what to use when."
---

## Summary

```
let a = SwiftSummary()
```

**@State** should be used for data for which source of truth lies in the same View, i.e. where the properties themselves are the source of truth. It can be used both with value types and reference types.

**Observable** is a protocol introduced with iOS 17 (i.e. 2023) that replaces `ObservableObject` protocol. It comes with an **@Observable** attached macro that reduces the boilerplate code needed to mark objects as something observable. There is no need to mark properties as `@Published`.


**@Bindable** can be used when the source of truth is elsewhere and the type conforms to `Observable` protocol. <br>If the source of truth lies in same View, it can be qualified with `@State` or even not qualified with anything.

> From what I have seen though, `@Bindable` however cannot be used with value types and with them **@Binding** should be used instead.

**@Environment** should be used when the environment is supposed to have the data which in turn has been put there by an ancestor using **environment()** modifier. The property that gets put in the environment with that modifier should be declared in an extension of **EnvironmentValues** struct, with the property being synthesized there using keys that conform to **EnvironmentKey** protocol. Such environment properties are guranteed to have a default value, and are hence safe to use.

> TestProject - TestSwiftUI ('State And Data Management' group there)

## The Gist

![](/SwiftUI-Gist.png)
