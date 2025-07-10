# FIG AI

The main UI App of FIG AI

# Atomic Design Pattern

## Atomic Design

Atomic design, developed by Brad Frost and Dave Olsen, is a methodology for crafting design systems with five fundamental building blocks, which, when combined, promote consistency, modularity, and scalability. In this post, we’re going to explore how these principles are a natural fit for building interfaces in React, and how we can extend the Atomic metaphor in useful ways such that we can map out components which have a dynamic lifecycle inside of an abstract ecosystem.

## Atomic Development

The five distinct levels of atomic design — atoms -> molecules -> organisms -> templates -> pages — map incredibly well to React’s component-based architecture.

![Atom Derisgn Methodology](https://github.com/somavamshi-stack/support-insight/blob/development/app/src/assets/atomic-design-process.png)

### Atoms

Basic building blocks of matter, such as a button, input or a form label. They’re not useful on their own.

### Molecules

Grouping atoms together, such as combining a button, input and form label to build functionality.

### Organisms

Combining molecules together to form organisms that make up a distinct section of an interface (i.e. navigation bar)

### Templates

Consisting mostly of groups of organisms to form a page — where clients can see a final design in place.

### Pages

An ecosystem that views different template renders. We can create multiple ecosystems into a single environment — the application.

## Let’s walk through this atomized Instagram interface

### Atoms

This screen of Instagram’s UI consists of a handful of icons, some text-level elements, and two image types: the primary image and the user’s avatar image.

### Molecules

Several icons form simple utilitarian components like the bottom navigation bar and the photo actions bar where users can like or comment on a photo. Also, simple combinations of text and/or images form relatively simple components.

### Organisms

Here we can see the photo organism take shape, which consists of the user’s information, time stamp, the photo itself, actions around that photo, and information about the photo including like count and caption. This organism becomes the cornerstone of the entire Instagram experience as it is stacked repeatedly in a never-ending stream of user-generated photos.

### Templates

We get to see our components come together in the context of a layout. Also, it’s here where we see the exposed content skeleton of the Instagram experience, highlighting dynamic content such as the user’s handle, avatar, photo, like count, and caption.

### Pages

And finally we see the final product, complete with real content poured into it, which helps ensure the underlying design system comes together to form a beautiful and functional UI.

## Advantages of atomic design
