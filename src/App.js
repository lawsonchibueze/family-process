import './App.css';

import Amplify, { API, graphqlOperation } from 'aws-amplify';
import { useEffect, useState, useReducer } from 'react';

import awsConfig from './aws-exports';
import { AmplifyAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listLists } from './graphql/queries';
import 'semantic-ui-css/semantic.min.css';
import MainHeaders from './components/headers/MainHeaders';
import Lists from './components/Lists/Lists';
import { Button, Container, Form, Icon, Modal } from 'semantic-ui-react';
Amplify.configure(awsConfig);

const initialState = {
	title: '',
	description: ''
};
function App() {
	function listReducer(state = initialState, action) {
		switch (action.type) {
			case 'DESCRIPTION':
				return { ...state, description: action.value };
			case 'TITLE_CHANGED':
				return { ...state, title: action.value };
			default:
				console.log('Default action for :', action);
				return state;
		}
	}
	async function fetchList() {
		const { data } = await API.graphql(graphqlOperation(listLists));
		setLists(data.listLists.items);
		console.log(data);
	}

	const [ state, dispatch ] = useReducer(listReducer, initialState);
	const [ lists, setLists ] = useState([]);
	const [ isModalOpen, setIsModalOpen ] = useState(true);
	useEffect(() => {
		fetchList();
	}, []);
	function toggleModal(shouldOpen) {
		setIsModalOpen(shouldOpen);
	}
	return (
		<AmplifyAuthenticator>
			<AmplifySignOut />

			<Container>
				<div className='App'>
					<MainHeaders />

					<Lists lists={lists} />
				</div>
				<Button className='floatingButton' onClick={() => toggleModal(true)}>
					<Icon name='plus' className='floatingButton_icon' />
				</Button>
			</Container>
			<Modal open={isModalOpen} dimmer='blurring'>
				<Modal.Header>Create yourList</Modal.Header>
				<Modal.Content>
					<Form>
						<Form.Input
							error={

									true ? false :
									{ Content: 'Please add a name to your title' }
							}
							label='List Title'
							placeholder='My pretty List'
							value={state.title}
							onChange={(e) => dispatch({ type: 'TITLE_CHANGED', value: e.target.vaue })}
						/>
						<Form.TextArea
							label='Description'
							placeholder='Things that my pretty list is a about'
							value={state.description}
							onChange={(e) => dispatch({ type: 'DESCRIPTION', value: e.target.vaue })}
						/>
					</Form>
				</Modal.Content>
				<Modal.Actions>
					<Button negative onClick={() => toggleModal(false)}>
						Cancel
					</Button>
					<Button positive onClick={() => toggleModal(false)}>
						Save
					</Button>
				</Modal.Actions>
			</Modal>
		</AmplifyAuthenticator>
	);
}

export default App;
