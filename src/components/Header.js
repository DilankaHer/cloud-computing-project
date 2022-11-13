import React from 'react';

const Header = ({ handleToggleDarkMode, signOut }) => {
	return (
		<div className='header'>
			<h1>Notes</h1>
			<button
				onClick={() =>
					handleToggleDarkMode(
						(previousDarkMode) => !previousDarkMode
					)
				}
				className='save'
			>
				Toggle Mode
			</button>
			<button
				onClick={signOut}
				className='save'
			>
				Sign Out
			</button>
		</div>
	);
};

export default Header;
