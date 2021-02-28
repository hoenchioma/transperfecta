import React, { useState, useCallback, useEffect, useMemo } from 'react';
import cn from 'classnames';
import { Search } from 'react-bootstrap-icons'
import axios from 'axios';
import queryString from 'query-string';

const styles = {
	header: {
		fontFamily: 'Source Serif Pro, serif',
		// fontFamily: 'Playfair Display, serif',
		fontWeight: 400,
		color: '#FFC700'
	},
	text: {
		// fontFamily: 'Source Serif Pro, serif',
		fontFamily: 'Source Serif Pro, serif',
		fontWeight: 300,
	}
}

interface DictItem {
	pron: Array<string>,
	bn: string,
	en: string,
	bn_syns: Array<string>,
	en_syns: Array<string>,
	sents: Array<string>,
}

interface State {
	word: string | null,
	data: DictItem | null,
	loading: boolean,
};

function processSent(sent: string): string {
	return sent.replaceAll('<b>', '<b><i>').replaceAll('</b>', '</i></b>');
}

const Dictionary: React.FC<any> = ({ location, history }): JSX.Element => {
	const wordFromQuery = queryString.parse(location.search)?.word as string;
	const [searchWord, setSearchWord] = useState(wordFromQuery);
	const [state, setState] = useState<State>({
		word: null,
		data: null,
		loading: false,
	});
	const word = useMemo(() => state.word, [state]);
	const loading = useMemo(() => state.loading, [state]);
	const data = useMemo(() => state.data, [state]);

	const search = useCallback(() => {
		if (searchWord) {
			setState({
				word: null,
				data: null,
				loading: true,
			});
		} else {
			setState({
				word: null,
				data: null,
				loading: false,
			});
		}
		history.push(queryString.stringifyUrl({
			url: '/dict',
			query: { word: searchWord }
		}));
	}, [searchWord, history]);

	// fetch data on page load
	useEffect(() => {
		setState({
			word: null,
			data: null,
			loading: true,
		});
	}, []);

	// fetch data when loading state is active
	useEffect(() => {
		if (loading) {
			axios.get(queryString.stringifyUrl({
				url: process.env.REACT_APP_BACKEND_URL as string,
				query: { word: searchWord },
			})).then((payload: any) => {
				// console.log(payload);
				const receivedData: DictItem = payload?.data?.data;
				setState({
					word: searchWord,
					data: receivedData,
					loading: false,
				});
			}).catch((err) => {
				console.log(err);
				setState({
					word: null,
					data: null,
					loading: false,
				});
			});
		}
	}, [loading, searchWord]);

	return (
		<div
			className={cn(
				'd-flex',
				'flex-column',
				'min-vh-100',
				'align-items-center',
				'justify-content-start',
			)}
			style={{
				fontFamily: 'Source Serif Pro, serif'
			}}
		>
			<div className={cn(
				'container-md',
				'd-flex',
				'flex-column',
				'px-5',
				'mx-lg-5',
				'py-5'
			)}>
				<div className={cn(
					'input-group',
					'align-self-center',
					'justify-content-center',
					'col-lg-10',
					'col-12',
					'mb-5'
				)}>
					<input
						className={cn('form-control')}
						type="search"
						placeholder="Search words"
						aria-label="Search"
						value={searchWord}
						onChange={(e) => setSearchWord(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								search();
							}
						}}
					/>
					<div className={cn('input-group-append')}>
						<button
							className={cn('btn', 'btn-warning')}
							type="button"
							onClick={() => search()}
						>
							<Search />
						</button>
					</div>
				</div>
				{
					data
						? (
							<>
								<h1 style={{
									fontFamily: 'Playfair Display',
									fontWeight: 400,
									// color: '#0597F2',
								}}>
									{word}
								</h1>
								<hr
									className="col-12 my-2 mb-4"
									style={{
										borderTop: '.5px solid white',
										opacity: '0.25',
									}}
								/>
								<h4 className="mt-2" style={styles.header}>Translation</h4>
								<text>{data?.bn}</text>
								{!!data?.bn_syns?.length && (
									<>
										<h4 className="mt-3" style={styles.header}>Bangla Synonyms</h4>
										<text style={styles.text}>{data?.bn_syns.join(', ')}</text>
									</>
								)}
								{!!data?.en_syns?.length && (
									<>
										<h4 className="mt-3" style={styles.header}>English Synonyms</h4>
										<text style={styles.text}>{data.en_syns.join(', ')}</text>
									</>
								)}
								{!!data?.sents?.length && (
									<>
										<h4 className="mt-3" style={styles.header}>Sentences</h4>
										{data?.sents.map((sent: string) => (
											<div
												dangerouslySetInnerHTML={{ __html: processSent(sent), }}
												style={styles.text}
											/>
										))}
									</>
								)}
							</>
						)
						: (
							<h3	
								className={cn(
									'align-self-center',
									'text-warning',
								)}
							>
								{loading? "Loading...": "Word Not Found"}
							</h3>
						)
				}
			</div >
		</div>
	);
}

export default Dictionary;