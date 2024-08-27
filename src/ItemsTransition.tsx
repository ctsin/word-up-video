import {
	AbsoluteFill,
	Audio,
	Easing,
	interpolate,
	Series,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';

import * as Tinos from '@remotion/google-fonts/Tinos';
import * as NotoSansSC from '@remotion/google-fonts/NotoSansSC';
const {fontFamily: TinosFontFamily} = Tinos.loadFont();
const {fontFamily: NotoSansSCFontFamily} = NotoSansSC.loadFont('normal', {
	weights: ['100'],
});

import {
	BACKGROUND_COLOR,
	COLOR,
	EntranceDurationInFrames,
	FPS,
	HIGHLIGHT,
	ItemDurationInFrames,
	PhoneticSign,
	secondaryBaseStyle,
	TransitionDurationInFrames,
	useLeft,
} from './Root';
import {FC, Fragment} from 'react';
import {z} from 'zod';
import {ItemsCompositionProps, ItemsSchema} from './types';
import {
	springTiming,
	TransitionSeries,
	useTransitionProgress,
} from '@remotion/transitions';
import {none} from '@remotion/transitions/none';

type SingleWordProps = {
	props: z.infer<typeof ItemsSchema>;
	index: number;
};

const Single = ({
	props: {wordList, affix, affixPhonetic},
	index,
}: SingleWordProps) => {
	const {entering, exiting} = useTransitionProgress();
	const {durationInFrames} = useVideoConfig();
	const {
		item,
		meaning,
		phonetic,
		mp3: {EN = '', US = ''},
	} = wordList[index];

	const [prefix, suffix] = item.split(affix);
	const [phoneticPrefix, phoneticSuffix] = phonetic.split(affixPhonetic);

	const fontSize = 40;
	const itemFontSize = fontSize * 5;
	const left = useLeft();
	const frame = useCurrentFrame();
	const inOutOpacity = interpolate(
		frame,
		[
			0,
			TransitionDurationInFrames,
			durationInFrames - TransitionDurationInFrames,
			durationInFrames,
		],
		[0, 1, 1, 0],
		{
			easing: Easing.inOut(Easing.ease),
		}
	);

	const enteringOpacity = interpolate(entering, [0, 1], [0, 1]);
	const enteringY = interpolate(entering, [0, 1], [itemFontSize, 0]);
	const exitingOpacity = interpolate(exiting, [0, 1], [1, 0]);
	const exitingY = interpolate(exiting, [0, 1], [0, -itemFontSize]);

	const meaningEnteringOpacity = interpolate(entering, [0, 1], [0, 1]);
	const meaningExitingOpacity = interpolate(exiting, [0, 1], [1, 0]);

	return (
		<AbsoluteFill
			style={{
				fontSize,
				fontFamily: TinosFontFamily,
				color: COLOR,
				top: '20%',
				opacity: inOutOpacity,
			}}
		>
			<Series>
				<Series.Sequence
					offset={FPS}
					durationInFrames={FPS * 2}
					name="En"
					layout="none"
				>
					<Audio src={EN} name={`${item} EN`} />
				</Series.Sequence>
				<Series.Sequence durationInFrames={FPS * 2} name="Us" layout="none">
					<Audio src={US} name={`${item} US`} />
				</Series.Sequence>
			</Series>

			<div
				style={{
					position: 'absolute',
					fontSize: itemFontSize,
					fontWeight: 700,
					left,
					top: 200,
				}}
			>
				<div
					style={{
						position: 'absolute',
						top: 0,
						right: '100%',
						transform: `translateY(${enteringY}px)`,
						opacity: enteringOpacity,
					}}
				>
					<div
						style={{
							position: 'absolute',
							top: 0,
							right: 0,
							transform: `translateY(${exitingY}px)`,
							opacity: exitingOpacity,
						}}
					>
						{prefix}
						<div
							style={{
								transform: `translateY(${enteringY}px)`,
								position: 'absolute',
								top: itemFontSize,
								right: 0,
								fontSize,
								whiteSpace: 'nowrap',
							}}
						>
							<PhoneticSign />
							{phoneticPrefix}
						</div>
					</div>
				</div>
				<div style={{color: HIGHLIGHT}}>
					{affix}
					<div
						style={{
							position: 'absolute',
							fontSize,
							top: itemFontSize,
							left: 0,
						}}
					>
						{affixPhonetic}

						{!phoneticSuffix && <PhoneticSign />}

						<div
							style={{
								opacity: meaningEnteringOpacity,
								position: 'absolute',
								top: '100%',
								left: 0,
							}}
						>
							<div
								style={{
									...secondaryBaseStyle,
									opacity: meaningExitingOpacity,
									position: 'absolute',
									top: 0,
									left: 0,
									fontFamily: NotoSansSCFontFamily,
									fontWeight: '100',
									fontSize: fontSize * 0.8,
									whiteSpace: 'nowrap',
								}}
							>
								{meaning.join('，')}
							</div>
						</div>
					</div>
				</div>
				<div
					style={{
						transform: `translateY(${enteringY}px)`,
						opacity: enteringOpacity,
						position: 'absolute',
						top: 0,
						left: '100%',
					}}
				>
					<div
						style={{
							transform: `translateY(${exitingY}px)`,
							opacity: exitingOpacity,
							position: 'absolute',
							top: 0,
							left: 0,
						}}
					>
						{suffix}
						{phoneticSuffix && (
							<div
								style={{
									position: 'absolute',
									fontSize,
									top: itemFontSize,
									left: 0,
									whiteSpace: 'nowrap',
								}}
							>
								{phoneticSuffix}
								<PhoneticSign />
							</div>
						)}
					</div>
				</div>
			</div>
		</AbsoluteFill>
	);
};

export const ItemsTransition: FC<ItemsCompositionProps> = (props) => {
	const {wordList} = props;

	return (
		<AbsoluteFill style={{backgroundColor: BACKGROUND_COLOR}}>
			<TransitionSeries
				style={{backgroundColor: BACKGROUND_COLOR}}
				showInTimeline={false}
				from={EntranceDurationInFrames}
			>
				{wordList.map((word, index) => {
					const {item} = word;
					return (
						<Fragment key={item}>
							<TransitionSeries.Transition
								presentation={none()}
								timing={springTiming({
									durationInFrames: TransitionDurationInFrames,
									config: {
										damping: 200,
									},
								})}
							/>
							<TransitionSeries.Sequence
								durationInFrames={ItemDurationInFrames}
								name={item}
							>
								<Single props={props} index={index} />
							</TransitionSeries.Sequence>
						</Fragment>
					);
				})}
			</TransitionSeries>
		</AbsoluteFill>
	);
};
