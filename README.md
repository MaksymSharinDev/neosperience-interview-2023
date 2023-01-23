# neosperience-interview-2023

## Beta: 
![](/_DOCS/media/Preview.gif)
## Release:
![](/_DOCS/media/Preview2.gif)

# Run

Clone this repo and:

- ```pnpm i```
- ```pnpm start```

# Process

Given the requirements document, we are presented with 5 JS exercises, one React exercise, and another CSS one. 

In order to structure the project accordingly, I decided to use a React Single Page Application (SPA), with a standard CRA boilerplate, and a Typescript template in order to reduce accidental complexity by strong typing. 

For the UI/UX design, I chose Groomet as it offers a number of advantages:

- Material Design: I am familiar with this design system and at the time of writing, it is the most popular UX choice due to Google's use in its products. Thus, the userbase attriction is minimized given the wide-spread use of Google Docs & Android.
- Flexible Carousel: Allows components to run inside its slides, which provides a pleasant interaction to present the exercises.
- Flexible Datatable: Provided a good base to work with, as I found the examples in Storybook to be sufficient to apply them to the React exercise requirements.
- Multiple Select: Most UI Frameworks don't provide a great component, but I found that Groomet does. This allowed me to use the best UI pattern (in my opinion, can be biased towards my user-persona) as seen in Airtable's product.

Regarding the JS Exercises, I wanted to add some fancyness and chose the CodeMirror library to provide the example snippets. I also used the GitHub Dark theme for the code highlights.

I wanted to make the code integral executable, so I remembered the microtemplating pattern. However, the Carousel was too short for the length of the code manipulated in this way, and Code Mirror had deprecated the formatting feature. 
Fortunately, I found that Prettier could be used both in the toolchain and in an app. Although it seemed an overshoot to use a library to format a one-liner code spanning multiple lines, it will pay off in the long run.

I also had the idea to add editing, a button, and a terminal-like execution result, but I suspended my efforts as those features were secondary nice to have and I needed to focus on other relevant requirements.

The React Exercise resembled the common to-do app used for hello-wording web-development frameworks. As I had dedicated the last year to Vue, and my React know-how was rusty (class components now being a legacy), I took some time to review my know-how.

I started to iteratively build feature by feature, committing after the first working iteration.

- Loading from JSON: I postponed implementation of the expected fetching from a JSON file in the static folder to prioritize other requirements. I put it as the initial value of the list memo variable, reacting to a change in the props when different from undefined. Memo is the way to optimize a possible recalculation, expecting this to happen in an imaginary "different list fetch" scenario.
- Implement the necessary components to display the list of items, where value is represented as a checkbox. I referred to the example provided here: https://storybook.grommet.io/?path=/story/visualizations-datatable-controlled--controlled-data-table, and adapted it by stripping unused code and by applying the proper namings for our business case.
- Implement a "Toggle All" checkbox, which on click shall select/deselect all rows. This was already resolved by the example found before.
- Implement a component to add an item to the list. The default value for a new item must be true. This is a personal preference, but I like Crud operation UIs being consistent between them. My hackish solution was to memoize an add button, and customize the inline data prop feeding with the add button, a simple text input and some disabled checkboxes. An improvement should be made to enable them.
- Implement for each item a "Toggle Done" button, which on click shall highlight the item as completed/not completed. It must be impossible to interact with the checkbox of an item in a completed state. I reused some code providing another channel to store the configuration as a state consisting of an array of ids in done, and making some conditional rendering checking for done ids, presenting a different style and disabled-status.
- Implement a component to filter the items in the list (All, Original Only, New, Selected, Not Selected, Completed). The graphical side of my challenge was to fit all possible tags in a little space and provide a pleasant filtering experience. I referred to the example here: https://storybook.grommet.io/?path=/story/input-selectmultiple-children--children, and adapted it by stripping unused code and customizing it. For the functional side, I had to change the approach as I could smell an over-generalization antipattern. I reverted my attempt to the previous commit of graphical readiness (keeping some improvements done like enum of the filters), and used a more harcoded but less coupled solution, a brownfield approach.

Regarding the CSS Exercise, it was pretty straightforward flexbox shenanigans. My cool perks this time were: using an iframe to keep the full viewport behavior intact, and a button to set it to 640px to show one of the requirements in action. I also used the :hover and :active pseudo elements to display-none the fourth element.

Some possible improvements for this simple app are:

- Implementation of JS code execution and console output result.
- Same for showing CSS code.
- Making the JS, CSS and React editable. The preview tech dependencies scene is mature for this.
- Re-working the item adding feature to another UX pattern like the popular "bottom right plus+ button".
- Inline editing of the item labels and the discard trash button.
- Live automated Testing/Tour Walkthrough UX Pattern.