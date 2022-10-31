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
		router.push('/Home');
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
							class="h-14 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="#FF00BF"
							stroke-width="2"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
							/>
						</svg>
					</button>
				</div>
			</div>
            </div>
  )
}

export default House