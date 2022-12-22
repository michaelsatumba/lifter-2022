import React from 'react';
import { useEffect, useState } from 'react';
import { authentication, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import {
	getDoc,
	getDocs,
	collection,
	doc,
	onSnapshot,
	query,
	setDoc,
	where,
} from 'firebase/firestore';

function Matches() {
	const [user, setUser] = useState();
	const [picture, setPicture] = useState();
	const [people, setPeople] = useState([
		{
			displayName: 'Jordan',
			photoURL:
				'https://images.unsplash.com/photo-1667238158829-880e8c3a89c9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw0fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=600&q=60',
			interest: 'bball',
		},
		{
			displayName: 'Ernie',
			photoURL:
				'https://images.unsplash.com/photo-1667136767321-8278d9ced831?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=600&q=60',
			interest: 'dribbling',
		},
		{
			displayName: 'Kenny',
			photoURL:
				'https://images.unsplash.com/photo-1667276978667-087337e015bd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw4fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=600&q=60',
			interest: 'shooting',
		},
		{
			displayName: 'Shaq',
			photoURL:
				'https://images.unsplash.com/photo-1667296940025-3550476fc2fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMnx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=60',
			interest: 'passing',
		},
		{
			displayName: 'Charles Barkley',
			photoURL:
				'https://images.unsplash.com/photo-1667307450467-79ccf8e172df?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxN3x8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=60',
			interest: 'blocking',
		},
	]);
	useEffect(() => {
		onAuthStateChanged(authentication, (user) => {
			if (user) {
				setUser(user);
				setPicture(
					<Image
						src={user?.photoURL}
						alt="userPhoto"
						layout="fill"
						className="rounded-full"
						width={500}
						height={500}
					/>
				);
				if (user) {
					getDoc(doc(db, 'users', user.uid)).then((docSnap) => {
						if (docSnap.exists()) {
							console.log(user.displayName, 'logged in!');
							let unsub; // initialize variable
							const fetchCards = async () => {
								// id's of people of nopes
								const nopes = await getDocs(
									collection(db, 'users', user.uid, 'nopes')
								).then((snapshot) => snapshot.docs.map((doc) => doc.id));

								// id's of people of swipes
								const swipes = await getDocs(
									collection(db, 'users', user.uid, 'swipes')
								).then((snapshot) => snapshot.docs.map((doc) => doc.id));

								const nopedUserIds = nopes.length > 0 ? nopes : ['test'];
								const swipedUserIds = swipes.length > 0 ? swipes : ['test'];

								unsub = onSnapshot(
									// query data where id does not equal id from nopedUserIds and swipedUserIds
									query(
										collection(db, 'users'),
										where('id', 'not-in', [...nopedUserIds, ...swipedUserIds])
									),
									(snapshot) => {
										setPeople(
											snapshot.docs
												.filter((doc) => doc.id !== user.uid)
												.map((doc) => ({
													id: doc.id,
													...doc.data(),
												}))
										);
									}
								);
							};
							fetchCards();
							return unsub;
						} else {
							router.push('/Home');
						}
					});
				}
			} else {
				console.log('not signed in');
				router.push('/');
			}
		});
	}, [db]);

	return (
		<div>
			<div className="flex justify-center">
				{people.map((person, index) => {
					return <p></p>;
				})}
			</div>
		</div>
	);
}

export default Matches;
