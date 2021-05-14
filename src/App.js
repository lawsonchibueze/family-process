import './App.css';

import Amplify, { API, graphqlOperation } from 'aws-amplify';
import { useEffect, useState } from 'react';

import awsConfig from './aws-exports';
import { AmplifyAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listLists } from './graphql/queries';
import 'semantic-ui-css/semantic.min.css';
import MainHeaders from './components/headers/MainHeaders';
import Lists from './components/Lists/Lists';
import { Button, Container, Form, Icon, Modal } from 'semantic-ui-react';
Amplify.configure(awsConfig);

function App() {
	async function fetchList() {
		const { data } = await API.graphql(graphqlOperation(listLists));
		setLists(data.listLists.items);
		console.log(data);
	}
	const [ lists, setLists ] = useState([]);
	const [ isModalOpen, setIsModalOpen ] = useState(false);
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
            <Form.Input label='List Title' placeholder='My pretty List' />
            <Form.TextArea label = "Description" placeholder = "Things that my pretty list is a about"></Form.TextArea>
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
