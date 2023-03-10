import './App.css';

import { Box, Carousel, Grommet, Page } from 'grommet';
import { useMemo, useRef } from 'react';

import { CssEx } from './components/CssEx';
import { ExList } from './components/ExList';
import { JSExercises } from './components/JSExercises';

function App() {


  // 
  return (
    <Grommet full>
      <Page background="dark-1" kind={"narrow"} height={"100%"} justify='center' align='center' >
        <Carousel>
          {
            [1, 2, 3, 4, 5].map(n =>
              <Box
                key={`s-exercise-${n}`}
                margin={"medium"} pad={"small"} style={{ backgroundColor: "var(--code-editor-background)", borderRadius: "20px", overflow: "hidden", paddingRight: "10px" }}>
                <JSExercises exNumber={n} />
              </Box>
            )
          }
          <Box margin={"medium"} >
            <ExList />
          </Box>
          <Box pad={"medium"} >
              <CssEx/>
          </Box>
        </Carousel>
      </Page>
    </Grommet >
  );
}

export default App;