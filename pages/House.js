import React, { useMemo, useRef } from 'react'
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
      displayName: 'Richard Hendricks',
      photoURL: 'https://images.unsplash.com/photo-1667238158829-880e8c3a89c9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw0fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=600&q=60',
      interest:'bball'
    },
    {
      displayName: 'Erlich Bachman',
      photoURL: 'https://images.unsplash.com/photo-1667136767321-8278d9ced831?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=600&q=60',
      interest:'dribbling'
    },
    {
      displayName: 'Monica Hall',
      photoURL: 'https://images.unsplash.com/photo-1667276978667-087337e015bd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw4fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=600&q=60',
      interest:'shooting'
    },
    {
      displayName: 'Jared Dunn',
      photoURL: 'https://images.unsplash.com/photo-1667296940025-3550476fc2fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMnx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=60',
      interest:'passing'
    },
    {
      displayName: 'Dinesh Chugtai',
      photoURL: 'https://images.unsplash.com/photo-1667307450467-79ccf8e172df?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxN3x8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=60',
      interest:'blocking'
    }
  ]
  

function House() {
    const router = useRouter();

    const [user, setUser] = useState();
	const [picture, setPicture] = useState();
    const colRef = collection(db, 'users');
	const [people, setPeople] = useState([
        {
          displayName: 'Jordan',
          photoURL: 'https://images.unsplash.com/photo-1667238158829-880e8c3a89c9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw0fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=600&q=60',
          interest:'bball'
        },
        {
          displayName: 'James',
          photoURL: 'https://images.unsplash.com/photo-1667136767321-8278d9ced831?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=600&q=60',
          interest:'dribbling'
        },
        {
          displayName: 'Kobe',
          photoURL: 'https://images.unsplash.com/photo-1667276978667-087337e015bd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw4fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=600&q=60',
          interest:'shooting'
        },
        {
          displayName: 'Wade',
          photoURL: 'https://images.unsplash.com/photo-1667296940025-3550476fc2fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMnx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=60',
          interest:'passing'
        },
        {
          displayName: 'Barkley',
          photoURL: 'https://images.unsplash.com/photo-1667307450467-79ccf8e172df?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxN3x8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=60',
          interest:'blocking'
        }
      ]);
    const [currentIndex, setCurrentIndex] = useState(people.length - 1)
	const [aliens, setAliens] = useState([
		{
			displayName: 'alien',
		},
	]);
    const [lastDirection, setLastDirection] = useState()
    // used for outOfFrame closure

    const currentIndexRef = useRef(currentIndex)
    
  
    const childRefs = useMemo(
      () =>
        Array(people.length)
          .fill(0)
          .map((i) => React.createRef()),
      []
    )
  
    const updateCurrentIndex = (val) => {
      setCurrentIndex(val)
      currentIndexRef.current = val
    }
  
    const canSwipe = currentIndex >= 0
  
    // set last direction and decrease current index
    const swiped = (direction, nameToDelete, index) => {
      setLastDirection(direction)
      updateCurrentIndex(index - 1)
    }
  
    const outOfFrame = (displayName, idx) => {
      console.log(`${displayName} (${idx}) left the screen!`, currentIndexRef.current)
      // handle the case in which go back is pressed before card goes outOfFrame
      currentIndexRef.current >= idx && childRefs[idx].current.restoreCard()
      // TODO: when quickly swipe and restore multiple times the same card,
      // it happens multiple outOfFrame events are queued and the card disappear
      // during latest swipes. Only the last outOfFrame event should be considered valid
    }
  
    const swipe = async (dir) => {
      if (canSwipe && currentIndex < people.length) {
         await childRefs[currentIndex].current.swipe(dir) // Swipe the card!
      }
    } 

    const logout = () => {
		signOut(authentication)
			.then(() => {
				router.push('/');
			})
			.catch((error) => {
				console.log(error);
			});
	};

    const goToHome = () => {
		router.push('/Home');
	};

    const goToChat = () => {
		router.push('/Chat');
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
                            console.log(user.uid, 'logged in!')
                            const q = query(colRef);
                    onSnapshot(q, (snapshot) => {
                       
            		setPeople(snapshot.docs
                            .filter((doc) => { console.log('user', user?.uid)
                                return doc.id !== user?.uid
                            })
            				.map((doc) => ({
            					id: doc.id,
            					...doc.data(),
            				}))
            		        );
            	        });
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

    useEffect(() => {
        setCurrentIndex(people.length - 1)
    }, [people])
    
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
         
      <div className='flex justify-center'>
      {people.map((character, index) => (
          <TinderCard ref={childRefs[index]} className="absolute flex flex-col bg-white h-3/4 w-3/4 rounded-xl border-gray-200 border-2" key={character.displayName} preventSwipe={['up', 'down']}  onSwipe={(dir) => swiped(dir, character.displayName, index)}  onCardLeftScreen={() => outOfFrame(character.displayName, index)}>
            <div className="flex h-3/4">
          {/* <div className='absolute top-0 h-full w-full rounded-xl'> */}
			    <Image
				src={character.photoURL}
				alt="personPhoto"
				layout="fill"
				className=""
                width={500}
                height={500}
				/>
			</div>
            <div className="p-5 flex flex-col">
			    <p className='text-xl font-bold text-black'>{character.displayName}</p>
				<p className='text-xl text-black'>{character.interest}</p>
			</div>
          </TinderCard>
        ))}
      </div>
      
        <div className='flex justify-center absolute inset-x-0 bottom-28'> 
        {lastDirection ? <h2 className='infoText'>You swiped {lastDirection}</h2> : <h2 className='infoText' />}
        </div>

            {/* buttons */}
        <div className='flex justify-evenly absolute inset-x-0 bottom-11'>
			<button
				// onPress={() => swipeRef.current.swipeLeft()}
                onClick={() => swipe('left')}
				className='items-center justify-center rounded-full w-16 h-16 bg-red-200'>
				{/* <Entypo name="cross" size={24} color="red" /> */}
			</button>
			<button
				// onPress={() => swipeRef.current.swipeRight()}
                onClick={() => swipe('right')}
				className='items-center justify-center rounded-full w-16 h-16 bg-green-200'>
				{/* <Entypo name="check" size={24} color="green" /> */}
			</button>
		</div>
    </div>
  )
}

export default House