import { Box, RadioButton } from 'grommet';
import { useCallback, useState } from 'react';

const CssEx = () => {

    const baseDesktopVW = 1080;
    const baseDesktopVH = 720;
    const baseMobileVW = 640;
    const baseMobileVH = 480;
    const desktopScale = 0.40
    const mobileScale = 0.68
    const [currentVW, setCurrentVW] = useState(baseDesktopVW);
    const [currentVH, setCurrentVH] = useState(baseDesktopVH);
    const [currentscale, seCurrentScale] = useState(desktopScale)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        if (value === "desktop") {
            setCurrentVW(baseDesktopVW);
            setCurrentVH(baseDesktopVH);
            seCurrentScale(desktopScale)
        } else {
            setCurrentVW(baseMobileVW);
            setCurrentVH(baseMobileVH);
            seCurrentScale(mobileScale)
        }
    };

    return (
        <>
            <Box direction={'row'} justify={"around"}>
                <RadioButton
                    type="radio"
                    name="viewport"
                    value="desktop"
                    label="1080px"
                    onChange={handleChange}
                    checked={currentVW === baseDesktopVW}
                />
                <RadioButton
                    name="viewport"
                    value="mobile"
                    label="640px"
                    onChange={handleChange}
                    checked={currentVW === baseMobileVW}
                />
                <span > {" click the 4th element ;)"}</span>
            </Box>
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: `scale(${currentscale}) translate(-50%, -50%)`,
                    transformOrigin: "top left",
                    margin: "0 auto"
                }}
            >
                <iframe
                    width={`${currentVW}px`}
                    height={`${currentVH}px`}
                    title="css-exercise" src="/css-exercise.html"
                    seamless={true}
                />
            </div>
        </>
    )
}
export { CssEx }