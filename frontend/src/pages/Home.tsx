import React, { useState } from 'react';
import { Search } from 'react-bootstrap-icons'
import cn from 'classnames';
import queryString from 'query-string';

const Home: React.FC<any> = ({ history }): JSX.Element => {
  const [word, setWord] = useState<string | undefined>(undefined);
  return (
    <div
      className={cn(
        'd-flex',
        'flex-column',
        'min-vh-100',
        'align-items-center',
        'justify-content-center',
      )}
      style={{ fontFamily: 'Source Serif Pro' }}
    >
      <div
        className={cn('h1', 'mb-4')}
        style={{ fontFamily: 'PlayFair Display SC', color: '#FFC700' }}
      >
        Transperfecta
			</div>
      <div
        className={cn('h5', 'mb-4')}
        style={{ fontFamily: 'Source Serif Pro', fontWeight: 300, }}
      >
        English to Bangla Dictionary using Perfect Hashing
			</div>
      <div
        className={cn(
          'input-group',
          'justify-content-center',
          'col-lg-4',
          'col-md-10',
        )}
      >
        <input
          className={cn('form-control')}
          type="search"
          placeholder="Search words"
          aria-label="Search"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              history.push(queryString.stringifyUrl({
                url: '/dict',
                query: { word }
              }));
            }
          }}
        />
        <div className={cn('input-group-append')}>
          <button
            className={cn('btn', 'btn-warning')}
            type="button"
            onClick={() => {
              history.push(queryString.stringifyUrl({
                url: '/dict',
                query: { word }
              }));
            }}
          >
            <Search />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;