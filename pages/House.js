import React from 'react'
import { useEffect, useState } from 'react';
import { authentication, db, storage } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import {
	addDoc,
    getDoc,
	collection,
	serverTimestamp,
	deleteDoc,
	doc,
	orderBy,
	onSnapshot,
	query,
	updateDoc,
} from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { useRouter } from 'next/router';
import Image from 'next/image';
import TinderCard from 'react-tinder-card'

const dbo = [
    {
      name: 'Richard Hendricks',
      url: 'https://images.unsplash.com/photo-1667238158829-880e8c3a89c9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw0fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=600&q=60'
    },
    {
      name: 'Erlich Bachman',
      url: 'https://images.unsplash.com/photo-1667136767321-8278d9ced831?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=600&q=60'
    },
    {
      name: 'Monica Hall',
      url: 'https://images.unsplash.com/photo-1667276978667-087337e015bd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw4fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=600&q=60'
    },
    {
      name: 'Jared Dunn',
      url: 'https://images.unsplash.com/photo-1667296940025-3550476fc2fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMnx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=60'
    },
    {
      name: 'Dinesh Chugtai',
      url: 'https://images.unsplash.com/photo-1667307450467-79ccf8e172df?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxN3x8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=60'
    }
  ]
  

function House() {
    const router = useRouter();

    const [user, setUser] = useState();
	const [picture, setPicture] = useState();

    const logout = () => {
		signOut(authentication)
			.then(() => {
				router.push('/');
			})
			.catch((error) => {
				console.log(error);
			});
	};

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
							console.log('works!');
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
	}, []);
    
    const goToHome = () => {
		router.push('/Home');
	};

    const goToChat = () => {
		router.push('/Chat');
	};

    const characters = dbo
    const [lastDirection, setLastDirection] = useState()
  
    const swiped = (direction, nameToDelete) => {
      console.log('removing: ' + nameToDelete)
      setLastDirection(direction)
    }
  
    const outOfFrame = (name) => {
      console.log(name + ' left the screen!')
    }

    const onSwipe = (left) => {
		console.log('You swiped: ' + left);
	};
      
  return (
    <div>
			<div className="flex justify-evenly">
				<button onClick={logout}>
					<div className="h-10 w-10 relative">{picture}</div>
				</button>
				<button onClick={goToHome}>
                    <p className='text-3xl font-bold text-[#FF00BF]'>Lifter</p>
				</button>

				<div>
					<button onClick={goToChat}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-14 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="#FF00BF"
							strokeWidth="2"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
							/>
						</svg>
					</button>
				</div>
			</div>

            {/* cards */}
         
      <div className='flex mt-6 justify-center h-screen'>
        {characters.map((character) =>
          <TinderCard className="absolute bg-red-500 h-3/4 w-3/4 rounded-xl" key={character.name} preventSwipe={['up', 'down']} onSwipe={(dir) => swiped(dir, character.name)}>
          <div className="h-24 w-24 relative">
          {/* <div className='absolute top-0 h-full w-full rounded-xl'> */}
								<Image
									src={character.url}
									alt="personPhoto"
									layout="fill"
									className=""
                                    width={500}
                                    height={500}
								/>
							</div>
                            <div className="p-5 flex flex-col">
								<p className='text-xl font-bold'>{character.name}</p>
								{/* <p>{person.interests}</p> */}
							</div>
          </TinderCard>
        )}
      </div>
      {lastDirection ? <h2 className='infoText'>You swiped {lastDirection}</h2> : <h2 className='infoText' />}
 

            {/* buttons */}
            <div className='flex justify-evenly mt-56'>
				<button
					// onPress={() => swipeRef.current.swipeLeft()}
					className='items-center justify-center rounded-full w-16 h-16 bg-red-200'>
					{/* <Entypo name="cross" size={24} color="red" /> */}
				</button>
				<button
					// onPress={() => swipeRef.current.swipeRight()}
					className='items-center justify-center rounded-full w-16 h-16 bg-green-200'>
					{/* <Entypo name="check" size={24} color="green" /> */}
				</button>
			</div>
        </div>
  )
}

export default House