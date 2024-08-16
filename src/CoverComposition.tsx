import {AbsoluteFill} from 'remotion';
import {
	BACKGROUND_COLOR,
	COLOR,
	CoverSchema,
	FlexCenter,
	HIGHLIGHT,
	WIDTH,
} from './Root';
import * as Tinos from '@remotion/google-fonts/Tinos';
import * as NotoSansSC from '@remotion/google-fonts/NotoSansSC';
import {z} from 'zod';
import {FC} from 'react';

export const CoverComposition: FC<z.infer<typeof CoverSchema>> = ({body}) => {
	const {fontFamily: TinosFontFamily} = Tinos.loadFont();
	const {fontFamily: NotoSansSCFontFamily} = NotoSansSC.loadFont('normal', {
		weights: ['100'],
	});
	return (
		<AbsoluteFill
			style={{
				...FlexCenter,
				fontSize: 200,
				fontFamily: TinosFontFamily,
				fontWeight: 700,
				color: HIGHLIGHT,
				backgroundColor: BACKGROUND_COLOR,
			}}
		>
			<AbsoluteFill
				style={{
					width: WIDTH,
					height: 120,
					inset: '50% 0 0 50%',
					backgroundImage:
						'repeating-linear-gradient(-45deg,transparent 0 20px,#fafafa 0 40px)',
				}}
			/>
			<div style={{position: 'relative', zIndex: 10}}>
				{body}
				<div
					style={{
						position: 'absolute',
						top: 240,
						right: 0,
						fontFamily: NotoSansSCFontFamily,
						fontSize: 30,
						fontWeight: 100,
						color: COLOR,
						zIndex: 10,
					}}
				>
					让词根生长
				</div>
			</div>
		</AbsoluteFill>
	);
};
