# neosperience-interview-2023

![](/_DOCS/media/Preview.gif)

# Process

First, given the requirements document we are presented with 5 js exercises, one react extercise, and another css one.
Canonically the structuring of the project should be 5 react files , one react micro-app, an one html with some inline css stylesheet,
but we think out of the box so we gonna handle the requirements as a project instead of disconnected exercise.
First let's aggregate to a common denominator, and set up some derivative implicit requirements that brings us to some choice to make:

- Technology: React Single Page Application
- Boilerplate: standard cra
- Bonus:  using typescript template to reduce our accidental complication by strong typing means

so we break down to UI/UX Designing, we want to reduce our development time by bartening our design freedom by selecting an opinioned UI Framework. \
Groomet despise it's not so great documentation and my inexperience with it, can meet our needs as in the discovery fase i found some reasonable advantages:

- Material Design: I am familiar with this design system and by the time of writing \
it is the most popular UX choice because of google's use in it's products, \
so the userbase attriction is minimized given the wide-spread use of google docs & android.
- Flexible Carousel that allow components running inside it's slides \
turining out to be a pleasuable interaction to present our exercises
- Flexible Datatable that will be a good base to work upon as examples in the storybook was enoght to \
apply them to the react exercise requirements
- Multiple Select, most of the UI Frameworks don't have a great component, i found that in groomet instead \
we could use the best UI pattern ( in my opinion, can be biased towards my user-persona ) \
that we can see at example used at the airtable product

So:

- UI Framework: Groomet

JS Exercises:
As i found them straightforward, i wanted to some fancyness to it, i looked for what is used around the web commonly \
for provide the example snippets, for those exercises i wanted to keep it simple and a self-contained soliution, avoiding to use embedding 
codepen/codesandbox/JSFiddle type of decision.
The solution i found that i found out being a tacit standard is the CodeMirror library,
i wanted also a familiar theme for code highlights, and so i use github dark theme.

As i wanted to make the code be integral executable code and not only some text, i remembered about a method found in the microtemplating pattern,
so i could convert the body of a function to a string

The problem was that the Carousel was too short for the lenght of the code manipulated in this way,
and Code Mirror, as i found out, deprecated and put out of his scope the formatting,
luckly i found that prettier, used commonly only in the toolchain, actually is featured to be used also in a app,
seems an overshoot using a library to limit the formatting of some one-liner code to a line char limit spanning multiple lines,
but in an app at scale that requires to showcase, edit code, and compile that library can re-pay itself in the long run

I also had the idea to add editing, a button, and a terminal-like execution result, i added some libs and experimented a little, \
but i suspended my efforts as those feature was secondary nice to have and aren't meant to consume my time as i later needed to focus on the other \
relevant requiremnts, the scope creep risk was mitigated 

React Exercise:
The requirments resemble the common to-do app used for hello-wording web-development frameworks, so not rocket science, \
but as i dedicated my last year to vue and my react know-how was rusty, ( class components now a legacy ), i took some time to \
review my know-how, there are ten standard hooks, i 6-8 are meant to archive the most of development, the other two are for rare scenarios,
also developing custom hooks are meant to decouple some business logic from the presentation one, 

in the light of my new theorical understanding but in the virtue of "You aren't gonna need it", i will start to iterativelly build feature for feature and commit it
at the first working iteration;

- Loading from json: 
  I postpone to implement the expected fetching from a json file in static folder to prioritize other requirements:
  i put it as initial value of the list memo variable, reacting to a change in the props when different from undefined,
  memo is the way to optimize a possible recalculation, the case i expecting this to happen is an immaginary "different list fetch" scenario

- Implement the necessary components to display the list of items, where value is represented as a checkbox
  Straight-forward Dont reinvent the wheel reffering to the example provided here: https://storybook.grommet.io/?path=/story/visualizations-datatable-controlled--controlled-data-table and adapted by stripping unused cose and by apply the proper namings for our business case

- Implement a "Toggle All" checkbox, which on click shall select/deselect all rows
  Was resolved already by the example found before, adherence to read the F Manual is accomplished :D 

- Implement a component to add an item to the list. The default value for a new item must be true
  This maybe is a personal preference but i like Crud operation UIs being consistent between themselfs, so my hackish solution is memoize an add button,
  and the custumize the inline data prop feeding with the add button, a simple text input and some disabled checkboxes, an improvement should me make them enabled      

- Implement for each item a "Toggle Done" button, which on click shall highlight the item as completed / not completed. 
  It will have to be impossible to interact with the checkbox of an item in a completed state
  we just reuse some code providing another channel to store the configuration as a state consisting of an array of ids in done
  and making some conditional rendering checking for done ids, presenting a different style and disabled-status   

- Implement a component to filter the items in the list (All, Original Only, New, Selected, Not Selected, Completed )
  So, Graphical side my challenge was to fit all possible tags in a little space and provide a pleasurable filtering experience, the example here:
  https://storybook.grommet.io/?path=/story/input-selectmultiple-children--children, fitted well with my plans and expected result, some strip and customization
  and we got a base to work upon, now for the functional side we reached the point 
  where different attempts to implement a tag system to conditionally render the records blocked the path, 
  that signalled to change the approach as i can smell an over-generalization antipattern, my strategy gonna be to revert my attempt to the previus commit of graphical readiness ( keeping some improvements done like enum of the filters ), and use a more harcoded but less coupled solution, a brownfield approach

  <!---TODO: Grammar -->
  Okey, i got it working with a cleaner code, two nice to have things are missing: the sticky behievior for add item row. and the hiding of Select All button, but as it is a groomet default, the example storybook for limited multi select is without this button, tried it but don't works, 
  i wanted to hide it because cause the buggy behievior of letting the user select incompatible filters but meanwhile
  i got a prettier scroolbar than default so I can say we are satisfied with the outcome,

  regards css exercise, pretty straightforward flexbox shenanigans, my cool perks this time could be: using an iframe to keep the full viewport behievior intact. and a button to set it to 640px to show one of requirements in action, the another one is the use of :hover and :active pseudo elements for display-noning the fourth element.


ok done what can be missing but are possible forards from this simple app:
- implementation of js code execution and console output result
- same for showup css code
- editability of js css and maybe the react, the preview tech dependencies scene is mature for this
- re-work item add to another UX pattern like the popular  "bottom right plus+ button"
- inline editing of the item labels and the discard trash button
- Live automated Testing / Tour Walktrhoug UX Pattern 