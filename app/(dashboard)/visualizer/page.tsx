'use client';
import { useState } from 'react';
import VisualizerCanvas from '@/components/visualizer/VisualizerCanvas';
import type { VisualizerState } from '@/lib/mock-data';

const BST_N=[{id:'n4',label:'4',x:150,y:0},{id:'n2',label:'2',x:70,y:90},{id:'n6',label:'6',x:230,y:90},{id:'n1',label:'1',x:20,y:180},{id:'n3',label:'3',x:120,y:180},{id:'n5',label:'5',x:185,y:180},{id:'n7',label:'7',x:275,y:180}];
const BST_E=[{source:'n4',target:'n2'},{source:'n4',target:'n6'},{source:'n2',target:'n1'},{source:'n2',target:'n3'},{source:'n6',target:'n5'},{source:'n6',target:'n7'}];
const GN=[{id:'A',label:'A',x:150,y:0},{id:'B',label:'B',x:50,y:90},{id:'C',label:'C',x:250,y:90},{id:'D',label:'D',x:50,y:180},{id:'E',label:'E',x:250,y:180}];
const GE=[{source:'A',target:'B'},{source:'A',target:'C'},{source:'B',target:'D'},{source:'C',target:'E'},{source:'D',target:'E'}];
const DN=[{id:'S',label:'S',x:0,y:80},{id:'A',label:'A(4)',x:120,y:0},{id:'B',label:'B(2)',x:120,y:160},{id:'C',label:'C',x:250,y:80},{id:'T',label:'T',x:380,y:80}];
const DE=[{source:'S',target:'A'},{source:'S',target:'B'},{source:'A',target:'C'},{source:'B',target:'C'},{source:'B',target:'T'},{source:'C',target:'T'}];
const TN=[{id:'t0',label:'T0',x:60,y:0},{id:'t1',label:'T1',x:260,y:0},{id:'t2',label:'T2',x:60,y:150},{id:'t3',label:'T3',x:260,y:150}];
const TE=[{source:'t0',target:'t2'},{source:'t1',target:'t2'},{source:'t1',target:'t3'},{source:'t2',target:'t3'}];

const ALGORITHMS=[
  {id:'bubble',name:'Bubble Sort',cat:'Sorting',type:'array' as const,tc:'O(n²)',sc:'O(1)',desc:'Repeatedly swap adjacent elements if out of order.',
   timeline:[
    {step:0,label:'Initial: [64,34,25,12,22,11,90]',array:[64,34,25,12,22,11,90],highlighted:[],pointers:{}},
    {step:1,label:'Pass1: swap 64↔34',array:[64,34,25,12,22,11,90],highlighted:[0,1],swapping:[0,1] as [number,number],pointers:{}},
    {step:2,label:'After pass 1: 90 bubbles to end',array:[34,25,12,22,11,64,90],highlighted:[6],pointers:{}},
    {step:3,label:'After pass 2: 64 in place',array:[25,12,22,11,34,64,90],highlighted:[5,6],pointers:{}},
    {step:4,label:'✅ Sorted: [11,12,22,25,34,64,90]',array:[11,12,22,25,34,64,90],highlighted:[0,1,2,3,4,5,6],pointers:{}},
   ] as VisualizerState[]},
  {id:'selection',name:'Selection Sort',cat:'Sorting',type:'array' as const,tc:'O(n²)',sc:'O(1)',desc:'Find minimum element each pass and place it at the beginning.',
   timeline:[
    {step:0,label:'Initial: [29,10,14,37,13]',array:[29,10,14,37,13],highlighted:[],pointers:{i:0}},
    {step:1,label:'Find min=10 at idx1, swap with idx0',array:[29,10,14,37,13],highlighted:[0,1],swapping:[0,1] as [number,number],pointers:{i:0}},
    {step:2,label:'After swap: [10,29,14,37,13]',array:[10,29,14,37,13],highlighted:[0],pointers:{i:1}},
    {step:3,label:'Find min=13 at idx4, swap with idx1',array:[10,29,14,37,13],highlighted:[1,4],swapping:[1,4] as [number,number],pointers:{i:1}},
    {step:4,label:'✅ Sorted: [10,13,14,29,37]',array:[10,13,14,29,37],highlighted:[0,1,2,3,4],pointers:{}},
   ] as VisualizerState[]},
  {id:'insertion',name:'Insertion Sort',cat:'Sorting',type:'array' as const,tc:'O(n²)',sc:'O(1)',desc:'Build sorted array by inserting each element into its correct position.',
   timeline:[
    {step:0,label:'Initial: [5,3,1,4,2] — sorted portion: [5]',array:[5,3,1,4,2],highlighted:[0],pointers:{key:1}},
    {step:1,label:'key=3: 3<5, shift 5 right → [3,5,1,4,2]',array:[3,5,1,4,2],highlighted:[0,1],pointers:{key:2}},
    {step:2,label:'key=1: shift 5,3 right → [1,3,5,4,2]',array:[1,3,5,4,2],highlighted:[0,1,2],pointers:{key:3}},
    {step:3,label:'key=4: 4<5, shift → [1,3,4,5,2]',array:[1,3,4,5,2],highlighted:[0,1,2,3],pointers:{key:4}},
    {step:4,label:'✅ key=2, insert → [1,2,3,4,5]',array:[1,2,3,4,5],highlighted:[0,1,2,3,4],pointers:{}},
   ] as VisualizerState[]},
  {id:'merge',name:'Merge Sort',cat:'Sorting',type:'array' as const,tc:'O(n log n)',sc:'O(n)',desc:'Divide array in half recursively, then merge sorted halves. Divide and conquer.',
   timeline:[
    {step:0,label:'Initial: [5,3,8,1,4,2] — split into halves',array:[5,3,8,1,4,2],highlighted:[],pointers:{}},
    {step:1,label:'Left half sorted: [3,5,8]',array:[3,5,8,1,4,2],highlighted:[0,1,2],pointers:{}},
    {step:2,label:'Right half sorted: [1,2,4]',array:[3,5,8,1,2,4],highlighted:[3,4,5],pointers:{}},
    {step:3,label:'Merging: compare 3 and 1 → take 1',array:[3,5,8,1,2,4],highlighted:[0,3],pointers:{L:0,R:3}},
    {step:4,label:'✅ Merged: [1,2,3,4,5,8]',array:[1,2,3,4,5,8],highlighted:[0,1,2,3,4,5],pointers:{}},
   ] as VisualizerState[]},
  {id:'quick',name:'Quick Sort',cat:'Sorting',type:'array' as const,tc:'O(n log n) avg',sc:'O(log n)',desc:'Choose a pivot, partition into smaller/larger, recurse on each partition.',
   timeline:[
    {step:0,label:'Initial: [8,3,5,1,4,2,9] — pivot=5',array:[8,3,5,1,4,2,9],highlighted:[2],pointers:{pivot:2}},
    {step:1,label:'Partition: left<5=[3,1,4,2], pivot=5, right=[8,9]',array:[3,1,4,2,5,8,9],highlighted:[4],pointers:{pivot:4}},
    {step:2,label:'Sort left [3,1,4,2]: pivot=2 → [1,2,3,4]',array:[1,2,3,4,5,8,9],highlighted:[0,1,2,3],pointers:{}},
    {step:3,label:'Right [8,9] already sorted',array:[1,2,3,4,5,8,9],highlighted:[5,6],pointers:{}},
    {step:4,label:'✅ Sorted: [1,2,3,4,5,8,9]',array:[1,2,3,4,5,8,9],highlighted:[0,1,2,3,4,5,6],pointers:{}},
   ] as VisualizerState[]},
  {id:'heap',name:'Heap Sort',cat:'Sorting',type:'array' as const,tc:'O(n log n)',sc:'O(1)',desc:'Build a max-heap, repeatedly extract maximum and heapify. In-place sorting.',
   timeline:[
    {step:0,label:'Initial: [4,10,3,5,1] — Build Max-Heap',array:[4,10,3,5,1],highlighted:[],pointers:{}},
    {step:1,label:'Max-Heap: [10,5,3,4,1]',array:[10,5,3,4,1],highlighted:[0],pointers:{}},
    {step:2,label:'Swap root(10) with last, heapify → [5,4,3,1,10]',array:[5,4,3,1,10],highlighted:[4],swapping:[0,4] as [number,number],pointers:{}},
    {step:3,label:'Swap root(5), heapify → [4,1,3,5,10]→extract',array:[4,1,3,5,10],highlighted:[3,4],swapping:[0,3] as [number,number],pointers:{}},
    {step:4,label:'✅ Sorted: [1,3,4,5,10]',array:[1,3,4,5,10],highlighted:[0,1,2,3,4],pointers:{}},
   ] as VisualizerState[]},
  {id:'counting',name:'Counting Sort',cat:'Sorting',type:'array' as const,tc:'O(n+k)',sc:'O(k)',desc:'Count occurrences of each element then reconstruct sorted array. Best for small integer ranges.',
   timeline:[
    {step:0,label:'Input: [4,2,2,8,3,3,1] — Count frequencies',array:[4,2,2,8,3,3,1],highlighted:[],pointers:{}},
    {step:1,label:'Count array (index=value): [0,1,2,2,1,0,0,0,1]',array:[0,1,2,2,1,0,0,0,1],highlighted:[1,2,3,4,8],pointers:{}},
    {step:2,label:'Prefix sums: [0,1,3,5,6,6,6,6,7]',array:[0,1,3,5,6,6,6,6,7],highlighted:[0,1,2,3,4],pointers:{}},
    {step:3,label:'Building output array from count...',array:[1,2,2,3,3,4,8,0,0],highlighted:[0,1,2,3,4,5,6],pointers:{}},
    {step:4,label:'✅ Sorted: [1,2,2,3,3,4,8]',array:[1,2,2,3,3,4,8],highlighted:[0,1,2,3,4,5,6],pointers:{}},
   ] as VisualizerState[]},
  {id:'shell',name:'Shell Sort',cat:'Sorting',type:'array' as const,tc:'O(n log² n)',sc:'O(1)',desc:'Generalization of insertion sort using diminishing gap sequences to move distant elements efficiently.',
   timeline:[
    {step:0,label:'Initial: [8,3,7,1,5,2,6,4] — gap=4',array:[8,3,7,1,5,2,6,4],highlighted:[0,4,1,5,2,6,3,7],pointers:{gap:4}},
    {step:1,label:'After gap=4 pass: [5,2,6,1,8,3,7,4]',array:[5,2,6,1,8,3,7,4],highlighted:[0,1,2,3],pointers:{gap:4}},
    {step:2,label:'gap=2: compare pairs at distance 2',array:[5,2,6,1,8,3,7,4],highlighted:[0,2,1,3],pointers:{gap:2}},
    {step:3,label:'After gap=2 pass: nearly sorted',array:[1,2,5,3,6,4,7,8],highlighted:[0,1,2,3,4,5],pointers:{gap:1}},
    {step:4,label:'✅ gap=1 (insertion sort): [1,2,3,4,5,6,7,8]',array:[1,2,3,4,5,6,7,8],highlighted:[0,1,2,3,4,5,6,7],pointers:{}},
   ] as VisualizerState[]},
  {id:'radix',name:'Radix Sort',cat:'Sorting',type:'array' as const,tc:'O(d·n)',sc:'O(n+k)',desc:'Sort integers digit by digit from least significant to most significant. Non-comparison based.',
   timeline:[
    {step:0,label:'Input: [170,45,75,90,802,24,2,66] — Sort by units digit',array:[170,45,75,90,802,24,2,66],highlighted:[],pointers:{pass:1}},
    {step:1,label:'After units digit: [170,90,802,2,24,45,75,66]',array:[170,90,802,2,24,45,75,66],highlighted:[0,1,2,3,4,5,6,7],pointers:{pass:1}},
    {step:2,label:'After tens digit: [802,2,24,45,66,170,75,90]',array:[802,2,24,45,66,170,75,90],highlighted:[0,1,2,3,4,5,6,7],pointers:{pass:2}},
    {step:3,label:'After hundreds digit: [2,24,45,66,75,90,170,802]',array:[2,24,45,66,75,90,170,802],highlighted:[0,1,2,3,4,5,6,7],pointers:{pass:3}},
    {step:4,label:'✅ Sorted: [2,24,45,66,75,90,170,802]',array:[2,24,45,66,75,90,170,802],highlighted:[0,1,2,3,4,5,6,7],pointers:{}},
   ] as VisualizerState[]},
  {id:'linear',name:'Linear Search',cat:'Searching',type:'array' as const,tc:'O(n)',sc:'O(1)',desc:'Scan each element one by one until the target is found. Simple but O(n) worst case.',
   timeline:[
    {step:0,label:'Array: [3,7,1,9,5,2,8] — Search for 9',array:[3,7,1,9,5,2,8],highlighted:[],pointers:{i:0}},
    {step:1,label:'i=0: 3 ≠ 9 — move right',array:[3,7,1,9,5,2,8],highlighted:[0],pointers:{i:0}},
    {step:2,label:'i=1: 7 ≠ 9 — move right',array:[3,7,1,9,5,2,8],highlighted:[1],pointers:{i:1}},
    {step:3,label:'i=2: 1 ≠ 9 — move right',array:[3,7,1,9,5,2,8],highlighted:[2],pointers:{i:2}},
    {step:4,label:'✅ i=3: 9 = 9 — FOUND at index 3!',array:[3,7,1,9,5,2,8],highlighted:[3],pointers:{i:3}},
   ] as VisualizerState[]},
  {id:'binary',name:'Binary Search',cat:'Searching',type:'array' as const,tc:'O(log n)',sc:'O(1)',desc:'Efficiently find target in sorted array by halving search space each step.',
   timeline:[
    {step:0,label:'Sorted array — searching for 7',array:[1,3,5,7,9,11,13,15],pointers:{left:0,right:7},highlighted:[]},
    {step:1,label:'mid=3, a[4]=9 > 7 → search left half',array:[1,3,5,7,9,11,13,15],pointers:{left:0,right:7,mid:4},highlighted:[4]},
    {step:2,label:'mid=1, a[1]=3 < 7 → search right half',array:[1,3,5,7,9,11,13,15],pointers:{left:0,right:3,mid:1},highlighted:[1]},
    {step:3,label:'mid=2, a[2]=5 < 7 → go right',array:[1,3,5,7,9,11,13,15],pointers:{left:2,right:3,mid:2},highlighted:[2]},
    {step:4,label:'✅ mid=3, a[3]=7 — FOUND at index 3!',array:[1,3,5,7,9,11,13,15],pointers:{left:3,right:3,mid:3},highlighted:[3]},
   ] as VisualizerState[]},
  {id:'jump',name:'Jump Search',cat:'Searching',type:'array' as const,tc:'O(√n)',sc:'O(1)',desc:'Jump ahead by √n steps in sorted array, then linear search backward. Optimal for sorted arrays.',
   timeline:[
    {step:0,label:'Array: [1,3,5,7,9,11,13,15] — find 11, block=√8≈3',array:[1,3,5,7,9,11,13,15],highlighted:[],pointers:{block:3}},
    {step:1,label:'Jump to idx 3: 7 < 11 — jump again',array:[1,3,5,7,9,11,13,15],highlighted:[3],pointers:{pos:3}},
    {step:2,label:'Jump to idx 6: 13 > 11 — search back in [idx3..6]',array:[1,3,5,7,9,11,13,15],highlighted:[6],pointers:{pos:6}},
    {step:3,label:'Linear search back: idx4=9, idx5=11',array:[1,3,5,7,9,11,13,15],highlighted:[4,5],pointers:{pos:5}},
    {step:4,label:'✅ Found 11 at index 5!',array:[1,3,5,7,9,11,13,15],highlighted:[5],pointers:{i:5}},
   ] as VisualizerState[]},
  {id:'two-sum',name:'Two Sum — Hash Map',cat:'Arrays',type:'array' as const,tc:'O(n)',sc:'O(n)',desc:'Find two indices summing to target using a hash map for O(1) complement lookups.',
   timeline:[
    {step:0,label:'[2,7,11,15] target=9 — Start scanning',array:[2,7,11,15],pointers:{i:0},highlighted:[]},
    {step:1,label:'i=0: num=2, need 7. Store {2:0}',array:[2,7,11,15],pointers:{i:0},highlighted:[0]},
    {step:2,label:'i=1: num=7, need 2. Found 2 in map! Return [0,1]',array:[2,7,11,15],pointers:{i:1},highlighted:[0,1]},
    {step:3,label:'✅ Answer: indices [0,1] — 2+7=9',array:[2,7,11,15],highlighted:[0,1],pointers:{}},
    {step:4,label:'O(n) hash map vs O(n²) brute force',array:[2,7,11,15],highlighted:[0,1],pointers:{}},
   ] as VisualizerState[]},
  {id:'kadane',name:"Kadane's Algorithm",cat:'Arrays',type:'array' as const,tc:'O(n)',sc:'O(1)',desc:'Find maximum subarray sum using DP. Track current subarray sum and global maximum.',
   timeline:[
    {step:0,label:'[-2,1,-3,4,-1,2,1,-5,4] — Find max subarray',array:[-2,1,-3,4,-1,2,1,-5,4],highlighted:[],pointers:{curr:0,max:-99}},
    {step:1,label:'i=1: curr=max(1,1-2)=1, maxSum=1',array:[-2,1,-3,4,-1,2,1,-5,4],highlighted:[1],pointers:{curr:1,max:1}},
    {step:2,label:'i=3: curr=max(4,-2+4)=4, maxSum=4',array:[-2,1,-3,4,-1,2,1,-5,4],highlighted:[3],pointers:{curr:4,max:4}},
    {step:3,label:'i=5: curr=2+3=5, maxSum=5',array:[-2,1,-3,4,-1,2,1,-5,4],highlighted:[3,4,5],pointers:{curr:5,max:5}},
    {step:4,label:'✅ i=6: curr=6, maxSum=6. Subarray=[4,-1,2,1]',array:[-2,1,-3,4,-1,2,1,-5,4],highlighted:[3,4,5,6],pointers:{curr:6,max:6}},
   ] as VisualizerState[]},
  {id:'dutch',name:'Dutch National Flag',cat:'Arrays',type:'array' as const,tc:'O(n)',sc:'O(1)',desc:'Sort array of 0s,1s,2s in single pass using three pointers lo/mid/hi.',
   timeline:[
    {step:0,label:'[2,0,2,1,1,0] — lo=0, mid=0, hi=5',array:[2,0,2,1,1,0],highlighted:[],pointers:{lo:0,mid:0,hi:5}},
    {step:1,label:'a[mid]=2 → swap with hi, hi-- → hi=4',array:[0,0,2,1,1,2],highlighted:[5],pointers:{lo:0,mid:0,hi:4}},
    {step:2,label:'a[mid]=0 → swap with lo, lo++,mid++',array:[0,0,2,1,1,2],highlighted:[0],pointers:{lo:1,mid:1,hi:4}},
    {step:3,label:'a[mid]=2 → swap with hi, hi-- → hi=3',array:[0,0,1,1,2,2],highlighted:[0,1],pointers:{lo:2,mid:2,hi:3}},
    {step:4,label:'✅ Sorted: [0,0,1,1,2,2]',array:[0,0,1,1,2,2],highlighted:[0,1,2,3,4,5],pointers:{}},
   ] as VisualizerState[]},
  {id:'two-ptr',name:'Two Pointers — Pair Sum',cat:'Arrays',type:'array' as const,tc:'O(n)',sc:'O(1)',desc:'Use left and right pointers on sorted array to find pair summing to target.',
   timeline:[
    {step:0,label:'Sorted: [1,2,4,6,8,10] — Find pair summing to 10',array:[1,2,4,6,8,10],highlighted:[],pointers:{L:0,R:5}},
    {step:1,label:'1+10=11 > 10 → move R left',array:[1,2,4,6,8,10],highlighted:[0,5],pointers:{L:0,R:4}},
    {step:2,label:'1+8=9 < 10 → move L right',array:[1,2,4,6,8,10],highlighted:[0,4],pointers:{L:1,R:4}},
    {step:3,label:'✅ 2+8=10 — FOUND! Pair=(2,8)',array:[1,2,4,6,8,10],highlighted:[1,4],pointers:{L:1,R:4}},
    {step:4,label:'O(n) vs O(n²) brute force — huge win!',array:[1,2,4,6,8,10],highlighted:[1,4],pointers:{}},
   ] as VisualizerState[]},
  {id:'sliding',name:'Sliding Window Maximum',cat:'Arrays',type:'array' as const,tc:'O(n)',sc:'O(k)',desc:'Find maximum in each window of size k using a monotonic deque. Classic sliding window.',
   timeline:[
    {step:0,label:'[1,3,-1,-3,5,3,6,7] k=3 — Window [1,3,-1], max=3',array:[1,3,-1,-3,5,3,6,7],highlighted:[0,1,2],pointers:{L:0,R:2}},
    {step:1,label:'Window [3,-1,-3] max=3',array:[1,3,-1,-3,5,3,6,7],highlighted:[1,2,3],pointers:{L:1,R:3}},
    {step:2,label:'Window [-1,-3,5] max=5',array:[1,3,-1,-3,5,3,6,7],highlighted:[2,3,4],pointers:{L:2,R:4}},
    {step:3,label:'Window [5,3,6] max=6',array:[1,3,-1,-3,5,3,6,7],highlighted:[4,5,6],pointers:{L:4,R:6}},
    {step:4,label:'✅ All window maxima: [3,3,5,5,6,7]',array:[3,3,5,5,6,7],highlighted:[0,1,2,3,4,5],pointers:{}},
   ] as VisualizerState[]},
  {id:'inorder',name:'Inorder Traversal',cat:'Trees',type:'tree' as const,tc:'O(n)',sc:'O(h)',desc:'Traverse BST: Left → Root → Right. Produces elements in sorted ascending order.',
   timeline:[
    {step:0,label:'BST Inorder = Left→Root→Right. Start at root 4',nodes:BST_N,edges:BST_E,activeNode:'n4'},
    {step:1,label:'Go left → 2 → left → visit 1 (leftmost leaf)',nodes:BST_N,edges:BST_E,activeNode:'n1'},
    {step:2,label:'Backtrack, visit 2',nodes:BST_N,edges:BST_E,activeNode:'n2'},
    {step:3,label:'Visit right child 3',nodes:BST_N,edges:BST_E,activeNode:'n3'},
    {step:4,label:'Visit root 4, then go right subtree',nodes:BST_N,edges:BST_E,activeNode:'n4'},
    {step:5,label:'Visit 5, 6, 7',nodes:BST_N,edges:BST_E,activeNode:'n6'},
    {step:6,label:'✅ Inorder: [1,2,3,4,5,6,7] — sorted!',nodes:BST_N,edges:BST_E,activeNode:'n7'},
   ] as VisualizerState[]},
  {id:'preorder',name:'Preorder Traversal',cat:'Trees',type:'tree' as const,tc:'O(n)',sc:'O(h)',desc:'Traverse BST: Root → Left → Right. Used to serialize/copy a tree.',
   timeline:[
    {step:0,label:'Preorder = Root→Left→Right.',nodes:BST_N,edges:BST_E,activeNode:'n4'},
    {step:1,label:'Visit root 4 first',nodes:BST_N,edges:BST_E,activeNode:'n4'},
    {step:2,label:'Go left subtree: visit 2',nodes:BST_N,edges:BST_E,activeNode:'n2'},
    {step:3,label:'Visit 1, then 3',nodes:BST_N,edges:BST_E,activeNode:'n1'},
    {step:4,label:'Go right subtree of root: visit 6',nodes:BST_N,edges:BST_E,activeNode:'n6'},
    {step:5,label:'Visit 5, then 7',nodes:BST_N,edges:BST_E,activeNode:'n5'},
    {step:6,label:'✅ Preorder: [4,2,1,3,6,5,7]',nodes:BST_N,edges:BST_E,activeNode:'n7'},
   ] as VisualizerState[]},
  {id:'postorder',name:'Postorder Traversal',cat:'Trees',type:'tree' as const,tc:'O(n)',sc:'O(h)',desc:'Traverse BST: Left → Right → Root. Used to delete tree or evaluate expression trees.',
   timeline:[
    {step:0,label:'Postorder = Left→Right→Root.',nodes:BST_N,edges:BST_E,activeNode:'n4'},
    {step:1,label:'Go to bottom-left leaf: visit 1',nodes:BST_N,edges:BST_E,activeNode:'n1'},
    {step:2,label:'Visit 3 (right of 2)',nodes:BST_N,edges:BST_E,activeNode:'n3'},
    {step:3,label:'Both children done → visit 2',nodes:BST_N,edges:BST_E,activeNode:'n2'},
    {step:4,label:'Visit 5, then 7',nodes:BST_N,edges:BST_E,activeNode:'n5'},
    {step:5,label:'Both children done → visit 6',nodes:BST_N,edges:BST_E,activeNode:'n6'},
    {step:6,label:'✅ Postorder: [1,3,2,5,7,6,4]',nodes:BST_N,edges:BST_E,activeNode:'n4'},
   ] as VisualizerState[]},
  {id:'levelorder',name:'Level Order (BFS Tree)',cat:'Trees',type:'tree' as const,tc:'O(n)',sc:'O(n)',desc:'Visit all nodes level by level using a queue. Outputs: [[4],[2,6],[1,3,5,7]].',
   timeline:[
    {step:0,label:'Level Order: use queue. Enqueue root [4]',nodes:BST_N,edges:BST_E,activeNode:'n4'},
    {step:1,label:'Visit 4, enqueue children [2,6]',nodes:BST_N,edges:BST_E,activeNode:'n4'},
    {step:2,label:'Visit 2, enqueue [1,3]. Queue=[6,1,3]',nodes:BST_N,edges:BST_E,activeNode:'n2'},
    {step:3,label:'Visit 6, enqueue [5,7]. Queue=[1,3,5,7]',nodes:BST_N,edges:BST_E,activeNode:'n6'},
    {step:4,label:'Visit all leaves: 1,3,5,7',nodes:BST_N,edges:BST_E,activeNode:'n1'},
    {step:5,label:'✅ Level Order: [[4],[2,6],[1,3,5,7]]',nodes:BST_N,edges:BST_E,activeNode:'n7'},
   ] as VisualizerState[]},
  {id:'bfs',name:'Breadth-First Search',cat:'Graphs',type:'tree' as const,tc:'O(V+E)',sc:'O(V)',desc:'Traverse graph level-by-level using a queue. Finds shortest path in unweighted graphs.',
   timeline:[
    {step:0,label:'Start BFS from A. Queue: [A]',nodes:GN,edges:GE,activeNode:'A'},
    {step:1,label:'Visit A, enqueue B,C. Queue: [B,C]',nodes:GN,edges:GE,activeNode:'A'},
    {step:2,label:'Visit B, enqueue D. Queue: [C,D]',nodes:GN,edges:GE,activeNode:'B'},
    {step:3,label:'Visit C, enqueue E. Queue: [D,E]',nodes:GN,edges:GE,activeNode:'C'},
    {step:4,label:'Visit D. Queue: [E]',nodes:GN,edges:GE,activeNode:'D'},
    {step:5,label:'✅ Visit E. BFS: A→B→C→D→E',nodes:GN,edges:GE,activeNode:'E'},
   ] as VisualizerState[]},
  {id:'dfs',name:'Depth-First Search',cat:'Graphs',type:'tree' as const,tc:'O(V+E)',sc:'O(V)',desc:'Traverse graph by going as deep as possible before backtracking. Uses a stack/recursion.',
   timeline:[
    {step:0,label:'Start DFS from A. Stack: [A]',nodes:GN,edges:GE,activeNode:'A'},
    {step:1,label:'Visit A → push B. Stack: [B,C]',nodes:GN,edges:GE,activeNode:'B'},
    {step:2,label:'Visit B → push D. Stack: [D,C]',nodes:GN,edges:GE,activeNode:'D'},
    {step:3,label:'Visit D → dead end, backtrack. Stack: [C]',nodes:GN,edges:GE,activeNode:'D'},
    {step:4,label:'Visit C → push E. Stack: [E]',nodes:GN,edges:GE,activeNode:'C'},
    {step:5,label:'✅ Visit E. DFS: A→B→D→C→E',nodes:GN,edges:GE,activeNode:'E'},
   ] as VisualizerState[]},
  {id:'dijkstra',name:"Dijkstra's Shortest Path",cat:'Graphs',type:'tree' as const,tc:'O((V+E)log V)',sc:'O(V)',desc:"Find shortest path from source to all nodes using greedy priority queue. No negative edges.",
   timeline:[
    {step:0,label:'S→A(4), S→B(2), B→C(1), A→C(3), C→T(2). Start: dist[S]=0',nodes:DN,edges:DE,activeNode:'S'},
    {step:1,label:'Process S: dist[B]=2, dist[A]=4. PQ=[B:2,A:4]',nodes:DN,edges:DE,activeNode:'S'},
    {step:2,label:'Process B(cost 2): dist[C]=3, dist[T]=7. PQ=[C:3,A:4,T:7]',nodes:DN,edges:DE,activeNode:'B'},
    {step:3,label:'Process C(cost 3): dist[T]=min(7,5)=5. PQ=[A:4,T:5]',nodes:DN,edges:DE,activeNode:'C'},
    {step:4,label:'Process A(cost 4): C already 3. Process T(cost 5).',nodes:DN,edges:DE,activeNode:'A'},
    {step:5,label:'✅ Shortest: S=0,B=2,C=3,A=4,T=5. Path: S→B→C→T',nodes:DN,edges:DE,activeNode:'T'},
   ] as VisualizerState[]},
  {id:'topo',name:'Topological Sort',cat:'Graphs',type:'tree' as const,tc:'O(V+E)',sc:'O(V)',desc:"Linear ordering of DAG vertices using Kahn's algorithm. Find all zero in-degree nodes first.",
   timeline:[
    {step:0,label:'DAG: T0→T2, T1→T2, T1→T3, T2→T3. Compute in-degrees.',nodes:TN,edges:TE,activeNode:'t0'},
    {step:1,label:'In-degrees: T0=0,T1=0,T2=2,T3=2. Queue: [T0,T1]',nodes:TN,edges:TE,activeNode:'t0'},
    {step:2,label:'Process T0: decrement T2 in-deg→1.',nodes:TN,edges:TE,activeNode:'t0'},
    {step:3,label:'Process T1: T2→0,T3→1. Enqueue T2.',nodes:TN,edges:TE,activeNode:'t1'},
    {step:4,label:'Process T2: T3→0. Enqueue T3.',nodes:TN,edges:TE,activeNode:'t2'},
    {step:5,label:'✅ Topo Order: T0→T1→T2→T3',nodes:TN,edges:TE,activeNode:'t3'},
   ] as VisualizerState[]},
  {id:'fib',name:'Fibonacci (Memoization)',cat:'Dynamic Prog.',type:'array' as const,tc:'O(n)',sc:'O(n)',desc:'Compute nth Fibonacci using top-down DP with memoization. Each subproblem solved once.',
   timeline:[
    {step:0,label:'Compute fib(7). memo=[0,1,?,?,?,?,?,?]',array:[0,1,0,0,0,0,0,0],highlighted:[0,1],pointers:{n:2}},
    {step:1,label:'fib(2)=fib(1)+fib(0)=1',array:[0,1,1,0,0,0,0,0],highlighted:[2],pointers:{n:3}},
    {step:2,label:'fib(3)=fib(2)+fib(1)=2',array:[0,1,1,2,0,0,0,0],highlighted:[3],pointers:{n:4}},
    {step:3,label:'fib(4)=3, fib(5)=5',array:[0,1,1,2,3,5,0,0],highlighted:[4,5],pointers:{n:6}},
    {step:4,label:'✅ fib(6)=8, fib(7)=13. memo complete!',array:[0,1,1,2,3,5,8,13],highlighted:[6,7],pointers:{n:7}},
   ] as VisualizerState[]},
  {id:'coin-dp',name:'Coin Change DP',cat:'Dynamic Prog.',type:'array' as const,tc:'O(n×k)',sc:'O(n)',desc:'Bottom-up DP: dp[i]=min coins for amount i. Fill table using each coin denomination.',
   timeline:[
    {step:0,label:'coins=[1,2,5], amount=6. Init dp=[0,∞,∞,∞,∞,∞,∞]',array:[0,99,99,99,99,99,99],highlighted:[0],pointers:{}},
    {step:1,label:'coin=1: dp=[0,1,2,3,4,5,6]',array:[0,1,2,3,4,5,6],highlighted:[1,2,3,4,5,6],pointers:{coin:1}},
    {step:2,label:'coin=2: dp=[0,1,1,2,2,3,3]',array:[0,1,1,2,2,3,3],highlighted:[2,3,4,5,6],pointers:{coin:2}},
    {step:3,label:'coin=5: dp[5]=1, dp[6]=2',array:[0,1,1,2,2,1,2],highlighted:[5,6],pointers:{coin:5}},
    {step:4,label:'✅ dp[6]=2 — use coins {5,1}',array:[0,1,1,2,2,1,2],highlighted:[6],pointers:{}},
   ] as VisualizerState[]},
  {id:'lis',name:'Longest Increasing Subsequence',cat:'Dynamic Prog.',type:'array' as const,tc:'O(n log n)',sc:'O(n)',desc:'Find length of longest strictly increasing subsequence using patience sorting / binary search.',
   timeline:[
    {step:0,label:'[10,9,2,5,3,7,101,18] — Build patience piles',array:[10,9,2,5,3,7,101,18],highlighted:[],pointers:{len:0}},
    {step:1,label:'Add 10→[10]. Replace with 9→[9]. Replace with 2→[2]',array:[10,9,2,5,3,7,101,18],highlighted:[0,1,2],pointers:{len:1}},
    {step:2,label:'Add 5: new pile→[2,5]',array:[10,9,2,5,3,7,101,18],highlighted:[3],pointers:{len:2}},
    {step:3,label:'Replace 5 with 3→[2,3]. Add 7→[2,3,7]',array:[10,9,2,5,3,7,101,18],highlighted:[4,5],pointers:{len:3}},
    {step:4,label:'✅ Add 101→[2,3,7,101]. Replace with 18→[2,3,7,18]. LIS=4',array:[2,3,7,18,0,0,0,0],highlighted:[0,1,2,3],pointers:{len:4}},
   ] as VisualizerState[]},
  {id:'knapsack',name:'0/1 Knapsack',cat:'Dynamic Prog.',type:'array' as const,tc:'O(n×W)',sc:'O(W)',desc:'Maximize value fitting items in knapsack of capacity W. Each item used at most once.',
   timeline:[
    {step:0,label:'Items[(w=1,v=1),(w=2,v=6),(w=3,v=10)] cap=6. dp=[0,0,0,0,0,0,0]',array:[0,0,0,0,0,0,0],highlighted:[],pointers:{}},
    {step:1,label:'Include item1(w=1,v=1): dp=[0,1,1,1,1,1,1]',array:[0,1,1,1,1,1,1],highlighted:[1,2,3,4,5,6],pointers:{item:1}},
    {step:2,label:'Include item2(w=2,v=6): dp=[0,1,6,7,7,7,7]',array:[0,1,6,7,7,7,7],highlighted:[2,3,4,5,6],pointers:{item:2}},
    {step:3,label:'Include item3(w=3,v=10): dp=[0,1,6,10,11,16,17]',array:[0,1,6,10,11,16,17],highlighted:[3,4,5,6],pointers:{item:3}},
    {step:4,label:'✅ Max value=17 at cap=6 (all 3 items: w=6,v=17)',array:[0,1,6,10,11,16,17],highlighted:[6],pointers:{}},
   ] as VisualizerState[]},
  {id:'lcs',name:'Longest Common Subsequence',cat:'Dynamic Prog.',type:'array' as const,tc:'O(m×n)',sc:'O(m×n)',desc:'Find length of longest subsequence present in both strings. Classic 2D DP problem.',
   timeline:[
    {step:0,label:'"ABCBDAB" and "BDCAB". LCS table row by row.',array:[0,0,0,0,0],highlighted:[],pointers:{}},
    {step:1,label:'Process B: match at col 1, dp row=[0,1,1,1,1]',array:[0,1,1,1,1],highlighted:[1],pointers:{row:1}},
    {step:2,label:'Process D: match at col 3, dp=[0,1,1,2,2]',array:[0,1,1,2,2],highlighted:[3],pointers:{row:2}},
    {step:3,label:'Process C: no new match, dp=[0,1,2,2,2]',array:[0,1,2,2,2],highlighted:[2],pointers:{row:3}},
    {step:4,label:'✅ LCS length=4. Subsequence="BCAB" or "BDAB"',array:[0,1,2,3,4],highlighted:[0,1,2,3,4],pointers:{}},
   ] as VisualizerState[]},
];

export default function VisualizerPage() {
  const [selected, setSelected] = useState(ALGORITHMS[0]);
  const categories = Array.from(new Set(ALGORITHMS.map(a => a.cat)));

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Algorithm Visualizer</h1>
        <p className="text-sm text-gray-500 mt-1">
          {ALGORITHMS.length} algorithms — step through execution with interactive animations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Algorithm Picker */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-card ring-1 ring-gray-100 overflow-hidden h-fit max-h-[calc(100vh-180px)] overflow-y-auto scrollbar-thin">
          <div className="px-4 py-3 border-b border-gray-100 sticky top-0 bg-white z-10">
            <h2 className="text-sm font-bold text-gray-900">Algorithms</h2>
            <p className="text-xs text-gray-400">{ALGORITHMS.length} available</p>
          </div>
          <div className="p-2">
            {categories.map(cat => (
              <div key={cat}>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 py-2 mt-1">{cat}</p>
                {ALGORITHMS.filter(a => a.cat === cat).map(algo => (
                  <button
                    key={algo.id}
                    id={`algo-${algo.id}`}
                    onClick={() => setSelected(algo)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all mb-0.5 flex items-center justify-between group ${
                      selected.id === algo.id
                        ? 'bg-brand-900 text-white'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>{algo.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      selected.id === algo.id
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
                    }`}>
                      {algo.timeline.length}
                    </span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Visualizer area */}
        <div className="lg:col-span-3 space-y-4">
          {/* Info card */}
          <div className="bg-gradient-teal-soft rounded-2xl p-4 border border-brand-100">
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div>
                <h2 className="text-base font-bold text-brand-900">{selected.name}</h2>
                <span className={`inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  selected.type === 'array'
                    ? 'bg-brand-100 text-brand-700'
                    : 'bg-violet-100 text-violet-700'
                }`}>
                  {selected.type === 'array' ? '📊 Array/List' : '🌳 Tree/Graph'}
                </span>
              </div>
              <div className="flex gap-2 flex-wrap">
                <span className="text-xs font-semibold text-brand-700 bg-brand-100 px-2.5 py-1 rounded-xl">
                  ⏱ {selected.tc}
                </span>
                <span className="text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-100 px-2.5 py-1 rounded-xl">
                  💾 {selected.sc}
                </span>
                <span className="text-xs font-semibold text-gray-600 bg-white border border-brand-100 px-2.5 py-1 rounded-xl">
                  {selected.timeline.length} steps
                </span>
              </div>
            </div>
            <p className="text-sm text-brand-800 mt-2 leading-relaxed">{selected.desc}</p>
          </div>

          {/* Canvas */}
          <VisualizerCanvas
            key={selected.id}
            stateTimeline={selected.timeline}
            type={selected.type}
            title={selected.name}
          />
        </div>
      </div>
    </div>
  );
}
