import {
	AbsoluteFill,
	Audio,
	interpolate,
	Sequence,
	Series,
	spring,
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
	ExitDurationInFrames,
	FPS,
	getDurationInFrames,
	HEIGHT,
	HIGHLIGHT,
	ItemDurationInFrames,
	ItemsCompositionProps,
	PhoneticSign,
	secondaryBaseStyle,
	useLeft,
	WordSchema,
} from './Root';
import {createContext, FC, useContext} from 'react';
import {z} from 'zod';
import {
	interpolateStyles,
	makeTransform,
	translateY,
} from '@remotion/animation-utils';

const Background = () => (
	<AbsoluteFill
		style={{
			backgroundColor: BACKGROUND_COLOR,
		}}
	/>
);

type SingleWordProps = {
	word: z.infer<typeof WordSchema>;
	index: number;
};

const Single = ({
	word: {
		item,
		meaning,
		phonetic,
		mp3: {EN = '', US = ''},
	},
	index,
}: SingleWordProps) => {
	const {affix, affixPhonetic} = useItems();
	const [prefix, suffix] = item.split(affix);
	const [phoneticPrefix, phoneticSuffix] = phonetic.split(affixPhonetic);

	const fontSize = 40;
	const itemFontSize = fontSize * 3;
	const rowHeight = fontSize * 8;
	const left = useLeft();
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const numberEnter = spring({frame, fps, config: {damping: 200}});
	const y = interpolate(numberEnter, [0, 1], [rowHeight, 0]);
	const opacity = interpolate(numberEnter, [0, 1], [0, 1]);

	const phoneticEnter = spring({
		frame: frame - 5,
		fps,
		config: {damping: 200},
	});
	const phoneticY = interpolate(phoneticEnter, [0, 1], [fontSize, 0]);
	const phoneticOpacity = interpolate(phoneticEnter, [0, 1], [0, 1]);

	const meaningEnter = spring({frame: frame - 10, fps, config: {damping: 200}});
	const meaningY = interpolate(meaningEnter, [0, 1], [fontSize, 0]);
	const meaningOpacity = interpolate(meaningEnter, [0, 1], [0, 1]);

	return (
		<AbsoluteFill
			style={{
				transform: `translateY(${y}px)`,
				fontSize,
				fontFamily: TinosFontFamily,
				color: COLOR,
				top: ++index * rowHeight,
				opacity,
			}}
		>
			<Series>
				<Series.Sequence
					offset={FPS}
					durationInFrames={FPS * 2}
					name="pronunciation"
					layout="none"
				>
					<Audio src={EN} name={`${item} EN`} />
				</Series.Sequence>
				<Series.Sequence
					durationInFrames={FPS * 2}
					name="pronunciation"
					layout="none"
				>
					<Audio src={US} name={`${item} US`} />
				</Series.Sequence>
			</Series>

			<div
				style={{
					position: 'absolute',
					fontSize: itemFontSize,
					fontWeight: 700,
					left,
					top: 0,
				}}
			>
				<div style={{position: 'absolute', top: 0, right: '100%'}}>
					{prefix}
					<div
						style={{
							transform: `translateY(${phoneticY}px)`,
							opacity: phoneticOpacity,
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
				<div style={{color: HIGHLIGHT}}>
					{affix}
					<div
						style={{
							transform: `translateY(${phoneticY}px)`,
							opacity: phoneticOpacity,
							position: 'absolute',
							fontSize,
							top: itemFontSize,
							left: 0,
						}}
					>
						{affixPhonetic}

						{!phoneticSuffix && <PhoneticSign />}
					</div>
					<div
						style={{
							...secondaryBaseStyle,
							transform: `translateY(${meaningY}px)`,
							opacity: meaningOpacity,
							position: 'absolute',
							top: fontSize * 4.5,
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
				<div
					style={{
						transform: `translateY(${phoneticY}px)`,
						opacity: phoneticOpacity,
						position: 'absolute',
						top: 0,
						left: '100%',
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
		</AbsoluteFill>
	);
};

const itemsContext = createContext<ItemsCompositionProps>(null!);

export const useItems = () => {
	const context = useContext(itemsContext);

	if (context === undefined)
		throw new Error('The context should be used in a provider');

	return context;
};

export const ItemsContextProvider: FC<ItemsCompositionProps> = ({
	...itemsCompositionProps
}) => {
	return (
		<ItemsProvider {...itemsCompositionProps}>
			<ItemsComposition />
		</ItemsProvider>
	);
};
export const ItemsProvider: FC<
	ItemsCompositionProps & {children: React.ReactNode}
> = ({children, ...itemsCompositionProps}) => {
	return (
		<itemsContext.Provider value={{...itemsCompositionProps}}>
			{children}
		</itemsContext.Provider>
	);
};

export const ItemsComposition = () => {
	const {wordList} = useItems();

	const {fps} = useVideoConfig();
	const frame = useCurrentFrame();
	const exit = spring({
		frame,
		fps,
		delay: getDurationInFrames(wordList.length) - ExitDurationInFrames,
		durationInFrames: ExitDurationInFrames * 0.3,
		config: {
			damping: 200,
		},
	});

	const styles = interpolateStyles(
		exit,
		[0, 1],
		[
			{opacity: 1, transform: makeTransform([translateY(0)])},
			{opacity: 0, transform: makeTransform([translateY(-(HEIGHT * 0.3))])},
		],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	return (
		<AbsoluteFill>
			<Background />

			<Sequence name="list" from={EntranceDurationInFrames} style={styles}>
				{wordList.map((word, index) => {
					const {item} = word;
					return (
						<Sequence
							key={item}
							from={index * ItemDurationInFrames}
							name={item}
						>
							<Single word={word} index={index} />
						</Sequence>
					);
				})}
			</Sequence>
		</AbsoluteFill>
	);
};
