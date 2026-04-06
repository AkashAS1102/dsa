// ============================================================
//  Mock data — replaces Supabase/Prisma for hackathon demo
// ============================================================
import { EXTENDED_PROBLEMS } from './problems-extended';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type Language = 'python' | 'cpp' | 'c' | 'java';
export type SubmissionStatus = 'Accepted' | 'Wrong Answer' | 'TLE' | 'Runtime Error' | 'Pending';

export interface Tag {
  id: string;
  name: string;
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface VisualizerState {
  step: number;
  label: string;
  array?: number[];
  pointers?: Record<string, number>;
  highlighted?: number[];
  swapping?: [number, number];
  nodes?: { id: string; label: string; x: number; y: number }[];
  edges?: { source: string; target: string }[];
  activeNode?: string;
}

export interface Problem {
  id: string;
  slug: string;
  title: string;
  difficulty: Difficulty;
  tags: Tag[];
  description: string;
  examples: { input: string; output: string; explanation?: string }[];
  constraints: string[];
  hints: string[];
  testCases: TestCase[];
  acceptanceRate: number;
  totalSubmissions: number;
  starterCode: Record<Language, string>;
  visualizerTimeline?: VisualizerState[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  points: number;
  rank: number;
  streak: number;
  joinedAt: string;
  solvedEasy: number;
  solvedMedium: number;
  solvedHard: number;
  totalSolved: number;
  topicsProgress: { topic: string; solved: number; total: number }[];
}

export interface Submission {
  id: string;
  problemId: string;
  problemTitle: string;
  language: Language;
  status: SubmissionStatus;
  executionTime: number;
  memory: number;
  submittedAt: string;
}

// ── Tags ─────────────────────────────────────────────────────
export const TAGS: Record<string, Tag> = {
  arrays:   { id: 'arrays',    name: 'Arrays'           },
  strings:  { id: 'strings',   name: 'Strings'          },
  hash:     { id: 'hash',      name: 'Hash Map'         },
  two:      { id: 'two',       name: 'Two Pointers'     },
  sliding:  { id: 'sliding',   name: 'Sliding Window'   },
  dp:       { id: 'dp',        name: 'Dynamic Prog.'    },
  trees:    { id: 'trees',     name: 'Trees'            },
  graphs:   { id: 'graphs',    name: 'Graphs'           },
  sorting:  { id: 'sorting',   name: 'Sorting'          },
  bsearch:  { id: 'bsearch',   name: 'Binary Search'    },
  stack:    { id: 'stack',     name: 'Stack'            },
  linked:   { id: 'linked',    name: 'Linked List'      },
  greedy:   { id: 'greedy',    name: 'Greedy'           },
  recursion:{ id: 'recursion', name: 'Recursion'        },
  math:     { id: 'math',      name: 'Math'             },
  heap:     { id: 'heap',      name: 'Heap'             },
  trie:     { id: 'trie',      name: 'Trie'             },
  backtrack:{ id: 'backtrack', name: 'Backtracking'     },
  bit:      { id: 'bit',       name: 'Bit Manipulation' },
  matrix:   { id: 'matrix',    name: 'Matrix'           },
  design:   { id: 'design',    name: 'Design'           },
  disjoint: { id: 'disjoint',  name: 'Disjoint Set'     },
};

// ── Problems ──────────────────────────────────────────────────
export const PROBLEMS: Problem[] = [
  {
    id: '1',
    slug: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    tags: [TAGS.arrays, TAGS.hash],
    acceptanceRate: 49.2,
    totalSubmissions: 14200000,
    description: `Given an array of integers \`nums\` and an integer \`target\`, return *indices of the two numbers such that they add up to target*.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
      { input: 'nums = [3,3], target = 6', output: '[0,1]' },
    ],
    constraints: [
      '2 ≤ nums.length ≤ 10⁴',
      '-10⁹ ≤ nums[i] ≤ 10⁹',
      '-10⁹ ≤ target ≤ 10⁹',
      'Only one valid answer exists.',
    ],
    hints: [
      'A brute-force approach using two nested loops has O(n²) complexity. Can you do better?',
      'Think about using a hash map to store elements you\'ve seen so far.',
      'For each element x, check if target - x exists in the hash map.',
    ],
    testCases: [
      { id: 'tc1', input: '[2,7,11,15]\n9', expectedOutput: '[0,1]', isHidden: false },
      { id: 'tc2', input: '[3,2,4]\n6', expectedOutput: '[1,2]', isHidden: false },
      { id: 'tc3', input: '[3,3]\n6', expectedOutput: '[0,1]', isHidden: true },
      { id: 'tc4', input: '[1,2,3,4,5]\n9', expectedOutput: '[3,4]', isHidden: true },
    ],
    starterCode: {
      python: `def twoSum(nums: list[int], target: int) -> list[int]:
    # Write your solution here
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

# Read input
import sys
line1 = input()
line2 = input()
nums = list(map(int, line1.strip()[1:-1].split(',')))
target = int(line2.strip())
print(twoSum(nums, target))`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); i++) {
        int comp = target - nums[i];
        if (seen.count(comp)) return {seen[comp], i};
        seen[nums[i]] = i;
    }
    return {};
}

int main() {
    // Example: nums = [2,7,11,15], target = 9
    vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    auto res = twoSum(nums, target);
    cout << "[" << res[0] << "," << res[1] << "]" << endl;
    return 0;
}`,
      c: `#include <stdio.h>
#include <stdlib.h>

int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    int* result = (int*)malloc(2 * sizeof(int));
    *returnSize = 2;
    for (int i = 0; i < numsSize; i++) {
        for (int j = i + 1; j < numsSize; j++) {
            if (nums[i] + nums[j] == target) {
                result[0] = i;
                result[1] = j;
                return result;
            }
        }
    }
    return result;
}

int main() {
    int nums[] = {2, 7, 11, 15};
    int target = 9;
    int returnSize;
    int* res = twoSum(nums, 4, target, &returnSize);
    printf("[%d,%d]\\n", res[0], res[1]);
    free(res);
    return 0;
}`,
      java: `import java.util.*;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int comp = target - nums[i];
            if (seen.containsKey(comp)) return new int[]{seen.get(comp), i};
            seen.put(nums[i], i);
        }
        return new int[]{};
    }

    public static void main(String[] args) {
        Solution sol = new Solution();
        int[] nums = {2, 7, 11, 15};
        int target = 9;
        int[] res = sol.twoSum(nums, target);
        System.out.println("[" + res[0] + "," + res[1] + "]");
    }
}`,
    },
    visualizerTimeline: [
      { step: 0, label: 'Start: array = [2,7,11,15], target = 9', array: [2,7,11,15], pointers: { i: 0 }, highlighted: [] },
      { step: 1, label: 'i=0: num=2, need 7. Store {2:0}', array: [2,7,11,15], pointers: { i: 0 }, highlighted: [0] },
      { step: 2, label: 'i=1: num=7, need 2. Found 2 in map! → return [0,1]', array: [2,7,11,15], pointers: { i: 1 }, highlighted: [0,1] },
    ],
  },
  {
    id: '2',
    slug: 'reverse-linked-list',
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    tags: [TAGS.linked, TAGS.recursion],
    acceptanceRate: 73.1,
    totalSubmissions: 5800000,
    description: `Given the \`head\` of a singly linked list, reverse the list, and return *the reversed list*.`,
    examples: [
      { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' },
      { input: 'head = [1,2]', output: '[2,1]' },
      { input: 'head = []', output: '[]' },
    ],
    constraints: [
      'The number of nodes in the list is the range [0, 5000].',
      '-5000 ≤ Node.val ≤ 5000',
    ],
    hints: [
      'Can you solve this iteratively? What about recursively?',
      'Use three pointers: prev, curr, next.',
    ],
    testCases: [
      { id: 'tc1', input: '1->2->3->4->5', expectedOutput: '5->4->3->2->1', isHidden: false },
      { id: 'tc2', input: '1->2', expectedOutput: '2->1', isHidden: false },
      { id: 'tc3', input: '', expectedOutput: '', isHidden: true },
    ],
    starterCode: {
      python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverseList(head):
    prev = None
    curr = head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev

# Build list 1->2->3->4->5
nodes = [ListNode(i) for i in range(1, 6)]
for i in range(4): nodes[i].next = nodes[i+1]
head = nodes[0]
rev = reverseList(head)
result = []
while rev:
    result.append(rev.val)
    rev = rev.next
print(result)`,
      cpp: `#include <bits/stdc++.h>
using namespace std;
struct ListNode { int val; ListNode* next; ListNode(int x): val(x), next(nullptr) {} };

ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr, *curr = head;
    while (curr) {
        ListNode* nxt = curr->next;
        curr->next = prev;
        prev = curr;
        curr = nxt;
    }
    return prev;
}

int main() {
    // Build 1->2->3->4->5
    ListNode* head = new ListNode(1);
    ListNode* cur = head;
    for (int i=2; i<=5; i++) { cur->next = new ListNode(i); cur = cur->next; }
    ListNode* rev = reverseList(head);
    while (rev) { cout << rev->val << " "; rev = rev->next; }
    cout << endl;
}`,
      c: `#include <stdio.h>
struct ListNode { int val; struct ListNode* next; };

struct ListNode* reverseList(struct ListNode* head) {
    struct ListNode* prev = NULL;
    struct ListNode* curr = head;
    while (curr) {
        struct ListNode* nxt = curr->next;
        curr->next = prev;
        prev = curr;
        curr = nxt;
    }
    return prev;
}
int main() { printf("Reverse Linked List\\n"); return 0; }`,
      java: `class Solution {
    static class ListNode { int val; ListNode next; ListNode(int x){val=x;} }
    public ListNode reverseList(ListNode head) {
        ListNode prev = null, curr = head;
        while (curr != null) {
            ListNode nxt = curr.next; curr.next = prev; prev = curr; curr = nxt;
        }
        return prev;
    }
    public static void main(String[] args) { System.out.println("Reverse Linked List"); }
}`,
    },
  },
  {
    id: '3',
    slug: 'longest-substring-without-repeating',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    tags: [TAGS.strings, TAGS.sliding, TAGS.hash],
    acceptanceRate: 33.8,
    totalSubmissions: 10400000,
    description: `Given a string \`s\`, find the length of the **longest substring** without repeating characters.`,
    examples: [
      { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.' },
      { input: 's = "bbbbb"', output: '1', explanation: 'The answer is "b", with length 1.' },
      { input: 's = "pwwkew"', output: '3', explanation: 'The answer is "wke", with length 3.' },
    ],
    constraints: [
      '0 ≤ s.length ≤ 5 × 10⁴',
      's consists of English letters, digits, symbols and spaces.',
    ],
    hints: [
      'Use a sliding window with two pointers.',
      'Use a hash set to track characters in the current window.',
      'When a repeat is found, shrink the window from the left.',
    ],
    testCases: [
      { id: 'tc1', input: 'abcabcbb', expectedOutput: '3', isHidden: false },
      { id: 'tc2', input: 'bbbbb', expectedOutput: '1', isHidden: false },
      { id: 'tc3', input: 'pwwkew', expectedOutput: '3', isHidden: true },
    ],
    starterCode: {
      python: `def lengthOfLongestSubstring(s: str) -> int:
    char_map = {}
    left = 0
    max_len = 0
    for right, char in enumerate(s):
        if char in char_map and char_map[char] >= left:
            left = char_map[char] + 1
        char_map[char] = right
        max_len = max(max_len, right - left + 1)
    return max_len

s = input()
print(lengthOfLongestSubstring(s))`,
      cpp: `#include <bits/stdc++.h>
using namespace std;
int lengthOfLongestSubstring(string s) {
    unordered_map<char,int> m;
    int left=0, maxLen=0;
    for(int r=0; r<s.size(); r++){
        if(m.count(s[r]) && m[s[r]]>=left) left=m[s[r]]+1;
        m[s[r]]=r; maxLen=max(maxLen,r-left+1);
    }
    return maxLen;
}
int main(){ string s; cin>>s; cout<<lengthOfLongestSubstring(s)<<endl; }`,
      c: `#include <stdio.h>
#include <string.h>
int lengthOfLongestSubstring(char* s) {
    int map[256]; memset(map,-1,sizeof(map));
    int left=0, maxLen=0, n=strlen(s);
    for(int r=0; r<n; r++){
        if(map[(int)s[r]]>=left) left=map[(int)s[r]]+1;
        map[(int)s[r]]=r; if(r-left+1>maxLen) maxLen=r-left+1;
    }
    return maxLen;
}
int main(){ char s[50001]; scanf("%s",s); printf("%d\\n",lengthOfLongestSubstring(s)); }`,
      java: `import java.util.*;
class Solution {
    public int lengthOfLongestSubstring(String s) {
        Map<Character,Integer> m = new HashMap<>();
        int left=0, max=0;
        for(int r=0; r<s.length(); r++){
            char c=s.charAt(r);
            if(m.containsKey(c) && m.get(c)>=left) left=m.get(c)+1;
            m.put(c,r); max=Math.max(max,r-left+1);
        }
        return max;
    }
    public static void main(String[] a){ Scanner sc=new Scanner(System.in); System.out.println(new Solution().lengthOfLongestSubstring(sc.next())); }
}`,
    },
  },
  {
    id: '4',
    slug: 'maximum-subarray',
    title: 'Maximum Subarray',
    difficulty: 'Medium',
    tags: [TAGS.arrays, TAGS.dp, TAGS.greedy],
    acceptanceRate: 49.5,
    totalSubmissions: 7200000,
    description: `Given an integer array \`nums\`, find the **subarray** with the largest sum, and return *its sum*.`,
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'The subarray [4,-1,2,1] has the largest sum 6.' },
      { input: 'nums = [1]', output: '1' },
      { input: 'nums = [5,4,-1,7,8]', output: '23' },
    ],
    constraints: ['1 ≤ nums.length ≤ 10⁵', '-10⁴ ≤ nums[i] ≤ 10⁴'],
    hints: ['Use Kadane\'s algorithm.', 'Keep track of current sum and max sum.'],
    testCases: [
      { id: 'tc1', input: '-2 1 -3 4 -1 2 1 -5 4', expectedOutput: '6', isHidden: false },
      { id: 'tc2', input: '1', expectedOutput: '1', isHidden: false },
      { id: 'tc3', input: '5 4 -1 7 8', expectedOutput: '23', isHidden: true },
    ],
    starterCode: {
      python: `def maxSubArray(nums):
    max_sum = curr = nums[0]
    for n in nums[1:]:
        curr = max(n, curr + n)
        max_sum = max(max_sum, curr)
    return max_sum

nums = list(map(int, input().split()))
print(maxSubArray(nums))`,
      cpp: `#include <bits/stdc++.h>
using namespace std;
int maxSubArray(vector<int>& n){ int mx=n[0],curr=n[0]; for(int i=1;i<n.size();i++){curr=max(n[i],curr+n[i]);mx=max(mx,curr);}return mx;}
int main(){int x;vector<int>v;while(cin>>x)v.push_back(x);cout<<maxSubArray(v)<<endl;}`,
      c: `#include <stdio.h>
int main(){int n[100005],sz=0,x;while(scanf("%d",&x)==1)n[sz++]=x;int mx=n[0],curr=n[0];for(int i=1;i<sz;i++){curr=curr+n[i]>n[i]?curr+n[i]:n[i];mx=mx>curr?mx:curr;}printf("%d\\n",mx);}`,
      java: `import java.util.*;
class Solution{
    public int maxSubArray(int[]n){int mx=n[0],c=n[0];for(int i=1;i<n.length;i++){c=Math.max(n[i],c+n[i]);mx=Math.max(mx,c);}return mx;}
    public static void main(String[]a){Scanner sc=new Scanner(System.in);List<Integer>l=new ArrayList<>();while(sc.hasNextInt())l.add(sc.nextInt());int[]n=l.stream().mapToInt(i->i).toArray();System.out.println(new Solution().maxSubArray(n));}
}`,
    },
  },
  {
    id: '5',
    slug: 'binary-search',
    title: 'Binary Search',
    difficulty: 'Easy',
    tags: [TAGS.arrays, TAGS.bsearch],
    acceptanceRate: 55.1,
    totalSubmissions: 3200000,
    description: `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`. If \`target\` exists, return its index. Otherwise, return \`-1\`.

You must write an algorithm with **O(log n)** runtime complexity.`,
    examples: [
      { input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4', explanation: '9 exists in nums and its index is 4' },
      { input: 'nums = [-1,0,3,5,9,12], target = 2', output: '-1', explanation: '2 does not exist in nums so return -1' },
    ],
    constraints: ['1 ≤ nums.length ≤ 10⁴', '-10⁴ < nums[i], target < 10⁴', 'All integers in nums are unique.', 'nums is sorted in ascending order.'],
    hints: ['Use two pointers: left and right.', 'Compute mid = (left + right) // 2 each iteration.'],
    testCases: [
      { id: 'tc1', input: '[-1,0,3,5,9,12]\n9', expectedOutput: '4', isHidden: false },
      { id: 'tc2', input: '[-1,0,3,5,9,12]\n2', expectedOutput: '-1', isHidden: false },
    ],
    starterCode: {
      python: `def search(nums, target):
    l, r = 0, len(nums) - 1
    while l <= r:
        mid = (l + r) // 2
        if nums[mid] == target: return mid
        elif nums[mid] < target: l = mid + 1
        else: r = mid - 1
    return -1

nums = list(map(int, input().strip()[1:-1].split(',')))
target = int(input())
print(search(nums, target))`,
      cpp: `#include <bits/stdc++.h>
using namespace std;
int search(vector<int>&nums,int t){int l=0,r=nums.size()-1;while(l<=r){int m=(l+r)/2;if(nums[m]==t)return m;else if(nums[m]<t)l=m+1;else r=m-1;}return -1;}
int main(){vector<int>v={-1,0,3,5,9,12};cout<<search(v,9)<<endl;}`,
      c: `#include <stdio.h>
int search(int*n,int sz,int t){int l=0,r=sz-1;while(l<=r){int m=(l+r)/2;if(n[m]==t)return m;else if(n[m]<t)l=m+1;else r=m-1;}return -1;}
int main(){int n[]={-1,0,3,5,9,12};printf("%d\\n",search(n,6,9));}`,
      java: `class Solution{
    public int search(int[]nums,int target){int l=0,r=nums.length-1;while(l<=r){int m=(l+r)/2;if(nums[m]==target)return m;else if(nums[m]<target)l=m+1;else r=m-1;}return -1;}
    public static void main(String[]a){int[]n={-1,0,3,5,9,12};System.out.println(new Solution().search(n,9));}
}`,
    },
    visualizerTimeline: [
      { step: 0, label: 'Start: nums=[-1,0,3,5,9,12], target=9', array: [-1,0,3,5,9,12], pointers: { left: 0, right: 5 }, highlighted: [] },
      { step: 1, label: 'mid=2, nums[2]=3 < 9, move left→3', array: [-1,0,3,5,9,12], pointers: { left: 0, right: 5, mid: 2 }, highlighted: [2] },
      { step: 2, label: 'mid=4, nums[4]=9 = target → FOUND at index 4', array: [-1,0,3,5,9,12], pointers: { left: 3, right: 5, mid: 4 }, highlighted: [4] },
    ],
  },
  {
    id: '6',
    slug: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    tags: [TAGS.strings, TAGS.stack],
    acceptanceRate: 40.8,
    totalSubmissions: 5100000,
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' },
    ],
    constraints: ['1 ≤ s.length ≤ 10⁴', 's consists of parentheses only \'()[]{}\'.'],
    hints: ['Use a stack.', 'Push open brackets; pop and check when you see a closing bracket.'],
    testCases: [
      { id: 'tc1', input: '()', expectedOutput: 'true', isHidden: false },
      { id: 'tc2', input: '()[]{} ', expectedOutput: 'true', isHidden: false },
      { id: 'tc3', input: '(]', expectedOutput: 'false', isHidden: true },
    ],
    starterCode: {
      python: `def isValid(s: str) -> bool:
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    for c in s:
        if c in mapping:
            top = stack.pop() if stack else '#'
            if mapping[c] != top: return False
        else:
            stack.append(c)
    return not stack

s = input()
print(str(isValid(s)).lower())`,
      cpp: `#include <bits/stdc++.h>
using namespace std;
bool isValid(string s){stack<char>st;for(char c:s){if(c=='('||c=='['||c=='{')st.push(c);else{if(st.empty())return false;char t=st.top();st.pop();if((c==')'&&t!='(')||(c==']'&&t!='[')||(c=='}'&&t!='{'))return false;}}return st.empty();}
int main(){string s;cin>>s;cout<<(isValid(s)?"true":"false")<<endl;}`,
      c: `#include <stdio.h>
#include <string.h>
int main(){char s[10005],stack[10005];int top=0;scanf("%s",s);for(int i=0;s[i];i++){char c=s[i];if(c=='('||c=='['||c=='{')stack[top++]=c;else{if(top==0){printf("false\\n");return 0;}char t=stack[--top];if((c==')'&&t!='(')||(c==']'&&t!='[')||(c=='}'&&t!='{')){printf("false\\n");return 0;}}}printf(top==0?"true\\n":"false\\n");}`,
      java: `import java.util.*;
class Solution{
    public boolean isValid(String s){Deque<Character>st=new ArrayDeque<>();for(char c:s.toCharArray()){if(c=='('||c=='['||c=='{')st.push(c);else{if(st.isEmpty())return false;char t=st.pop();if((c==')'&&t!='(')||(c==']'&&t!='[')||(c=='}'&&t!='{'))return false;}}return st.isEmpty();}
    public static void main(String[]a){Scanner sc=new Scanner(System.in);System.out.println(new Solution().isValid(sc.next()));}
}`,
    },
  },
  {
    id: '7',
    slug: 'merge-intervals',
    title: 'Merge Intervals',
    difficulty: 'Medium',
    tags: [TAGS.arrays, TAGS.sorting],
    acceptanceRate: 46.2,
    totalSubmissions: 4300000,
    description: `Given an array of \`intervals\` where \`intervals[i] = [starti, endi]\`, merge all overlapping intervals, and return *an array of the non-overlapping intervals that cover all the intervals in the input*.`,
    examples: [
      { input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]', explanation: 'Since intervals [1,3] and [2,6] overlap, merge them into [1,6].' },
      { input: 'intervals = [[1,4],[4,5]]', output: '[[1,5]]', explanation: 'Intervals [1,4] and [4,5] are considered overlapping.' },
    ],
    constraints: ['1 ≤ intervals.length ≤ 10⁴', 'intervals[i].length == 2', '0 ≤ starti ≤ endi ≤ 10⁴'],
    hints: ['Sort intervals by start time.', 'Compare each interval with the last merged interval.'],
    testCases: [
      { id: 'tc1', input: '[[1,3],[2,6],[8,10],[15,18]]', expectedOutput: '[[1,6],[8,10],[15,18]]', isHidden: false },
    ],
    starterCode: {
      python: `def merge(intervals):
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    for start, end in intervals[1:]:
        if start <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])
    return merged

print(merge([[1,3],[2,6],[8,10],[15,18]]))`,
      cpp: `#include <bits/stdc++.h>
using namespace std;
vector<vector<int>> merge(vector<vector<int>>&iv){sort(iv.begin(),iv.end());vector<vector<int>>res={iv[0]};for(auto&i:iv){if(i[0]<=res.back()[1])res.back()[1]=max(res.back()[1],i[1]);else res.push_back(i);}return res;}
int main(){vector<vector<int>>iv={{1,3},{2,6},{8,10},{15,18}};auto r=merge(iv);for(auto&v:r)cout<<"["<<v[0]<<","<<v[1]<<"]";}`,
      c: `#include <stdio.h>
int main(){printf("[[1,6],[8,10],[15,18]]\\n");}`,
      java: `import java.util.*;
class Solution{
    public int[][] merge(int[][]iv){Arrays.sort(iv,(a,b)->a[0]-b[0]);List<int[]>res=new ArrayList<>();res.add(iv[0]);for(int[]i:iv){if(i[0]<=res.get(res.size()-1)[1])res.get(res.size()-1)[1]=Math.max(res.get(res.size()-1)[1],i[1]);else res.add(i);}return res.toArray(new int[0][]);}
    public static void main(String[]a){System.out.println("[[1,6],[8,10],[15,18]]");}
}`,
    },
  },
  {
    id: '8',
    slug: 'coin-change',
    title: 'Coin Change',
    difficulty: 'Medium',
    tags: [TAGS.dp],
    acceptanceRate: 41.3,
    totalSubmissions: 3800000,
    description: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.

Return *the fewest number of coins that you need to make up that amount*. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.

You may assume that you have an infinite number of each kind of coin.`,
    examples: [
      { input: 'coins = [1,5,6,9], amount = 11', output: '2', explanation: '11 = 5 + 6' },
      { input: 'coins = [2], amount = 3', output: '-1' },
      { input: 'coins = [1], amount = 0', output: '0' },
    ],
    constraints: ['1 ≤ coins.length ≤ 12', '1 ≤ coins[i] ≤ 2³¹ - 1', '0 ≤ amount ≤ 10⁴'],
    hints: ['Use bottom-up DP.', 'dp[i] = min coins to make amount i.'],
    testCases: [
      { id: 'tc1', input: '[1,5,6,9]\n11', expectedOutput: '2', isHidden: false },
      { id: 'tc2', input: '[2]\n3', expectedOutput: '-1', isHidden: false },
    ],
    starterCode: {
      python: `def coinChange(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for coin in coins:
        for x in range(coin, amount + 1):
            dp[x] = min(dp[x], dp[x - coin] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1

coins = list(map(int, input().strip()[1:-1].split(',')))
amount = int(input())
print(coinChange(coins, amount))`,
      cpp: `#include <bits/stdc++.h>
using namespace std;
int coinChange(vector<int>&c,int a){vector<int>dp(a+1,INT_MAX);dp[0]=0;for(int cn:c)for(int x=cn;x<=a;x++)if(dp[x-cn]!=INT_MAX)dp[x]=min(dp[x],dp[x-cn]+1);return dp[a]==INT_MAX?-1:dp[a];}
int main(){vector<int>c={1,5,6,9};cout<<coinChange(c,11);}`,
      c: `#include <stdio.h>
int main(){printf("2\\n");}`,
      java: `import java.util.*;
class Solution{
    public int coinChange(int[]coins,int amount){int[]dp=new int[amount+1];Arrays.fill(dp,amount+1);dp[0]=0;for(int c:coins)for(int x=c;x<=amount;x++)dp[x]=Math.min(dp[x],dp[x-c]+1);return dp[amount]>amount?-1:dp[amount];}
    public static void main(String[]a){System.out.println(new Solution().coinChange(new int[]{1,5,6,9},11));}
}`,
    },
  },
  {
    id: '9',
    slug: 'number-of-islands',
    title: 'Number of Islands',
    difficulty: 'Medium',
    tags: [TAGS.graphs, TAGS.arrays],
    acceptanceRate: 55.7,
    totalSubmissions: 5600000,
    description: `Given an \`m x n\` 2D binary grid \`grid\` which represents a map of \`'1'\`s (land) and \`'0'\`s (water), return *the number of islands*.

An **island** is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.`,
    examples: [
      { input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', output: '1' },
      { input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', output: '3' },
    ],
    constraints: ['m == grid.length', 'n == grid[i].length', '1 ≤ m, n ≤ 300', 'grid[i][j] is \'0\' or \'1\'.'],
    hints: ['Use DFS or BFS.', 'Mark visited cells to avoid double counting.'],
    testCases: [
      { id: 'tc1', input: '[[1,1,0],[1,0,0],[0,0,1]]', expectedOutput: '2', isHidden: false },
    ],
    starterCode: {
      python: `def numIslands(grid):
    if not grid: return 0
    count = 0
    def dfs(i, j):
        if i<0 or i>=len(grid) or j<0 or j>=len(grid[0]) or grid[i][j]!='1': return
        grid[i][j]='0'
        dfs(i+1,j); dfs(i-1,j); dfs(i,j+1); dfs(i,j-1)
    for i in range(len(grid)):
        for j in range(len(grid[0])):
            if grid[i][j]=='1': count+=1; dfs(i,j)
    return count

grid=[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]
print(numIslands(grid))`,
      cpp: `#include <bits/stdc++.h>
using namespace std;
void dfs(vector<vector<char>>&g,int i,int j){if(i<0||i>=g.size()||j<0||j>=g[0].size()||g[i][j]!='1')return;g[i][j]='0';dfs(g,i+1,j);dfs(g,i-1,j);dfs(g,i,j+1);dfs(g,i,j-1);}
int numIslands(vector<vector<char>>&g){int c=0;for(int i=0;i<g.size();i++)for(int j=0;j<g[0].size();j++)if(g[i][j]=='1'){c++;dfs(g,i,j);}return c;}
int main(){vector<vector<char>>g={{'1','1','0'},{'1','0','0'},{'0','0','1'}};cout<<numIslands(g);}`,
      c: `#include <stdio.h>
int main(){printf("2\\n");}`,
      java: `class Solution{
    void dfs(char[][]g,int i,int j){if(i<0||i>=g.length||j<0||j>=g[0].length||g[i][j]!='1')return;g[i][j]='0';dfs(g,i+1,j);dfs(g,i-1,j);dfs(g,i,j+1);dfs(g,i,j-1);}
    public int numIslands(char[][]g){int c=0;for(int i=0;i<g.length;i++)for(int j=0;j<g[0].length;j++)if(g[i][j]=='1'){c++;dfs(g,i,j);}return c;}
    public static void main(String[]a){System.out.println("3");}
}`,
    },
  },
  {
    id: '10',
    slug: 'trapping-rain-water',
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    tags: [TAGS.arrays, TAGS.two, TAGS.dp],
    acceptanceRate: 57.3,
    totalSubmissions: 3900000,
    description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is \`1\`, compute how much water it can trap after raining.`,
    examples: [
      { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6', explanation: 'The elevation map traps 6 units of rain water.' },
      { input: 'height = [4,2,0,3,2,5]', output: '9' },
    ],
    constraints: ['n == height.length', '1 ≤ n ≤ 2 × 10⁴', '0 ≤ height[i] ≤ 10⁵'],
    hints: ['Two-pointer approach works in O(n) time.', 'Left max and right max arrays can also solve this.'],
    testCases: [
      { id: 'tc1', input: '0 1 0 2 1 0 1 3 2 1 2 1', expectedOutput: '6', isHidden: false },
      { id: 'tc2', input: '4 2 0 3 2 5', expectedOutput: '9', isHidden: false },
    ],
    starterCode: {
      python: `def trap(height):
    l, r = 0, len(height) - 1
    left_max = right_max = water = 0
    while l < r:
        if height[l] < height[r]:
            left_max = max(left_max, height[l])
            water += left_max - height[l]
            l += 1
        else:
            right_max = max(right_max, height[r])
            water += right_max - height[r]
            r -= 1
    return water

height = list(map(int, input().split()))
print(trap(height))`,
      cpp: `#include <bits/stdc++.h>
using namespace std;
int trap(vector<int>&h){int l=0,r=h.size()-1,lm=0,rm=0,w=0;while(l<r){if(h[l]<h[r]){lm=max(lm,h[l]);w+=lm-h[l++];}else{rm=max(rm,h[r]);w+=rm-h[r--];}}return w;}
int main(){vector<int>h={0,1,0,2,1,0,1,3,2,1,2,1};cout<<trap(h);}`,
      c: `#include <stdio.h>
int main(){int h[]={0,1,0,2,1,0,1,3,2,1,2,1},l=0,r=11,lm=0,rm=0,w=0;while(l<r){if(h[l]<h[r]){if(h[l]>lm)lm=h[l];w+=lm-h[l++];}else{if(h[r]>rm)rm=h[r];w+=rm-h[r--];}}printf("%d\\n",w);}`,
      java: `import java.util.*;
class Solution{
    public int trap(int[]h){int l=0,r=h.length-1,lm=0,rm=0,w=0;while(l<r){if(h[l]<h[r]){lm=Math.max(lm,h[l]);w+=lm-h[l++];}else{rm=Math.max(rm,h[r]);w+=rm-h[r--];}}return w;}
    public static void main(String[]a){System.out.println(new Solution().trap(new int[]{0,1,0,2,1,0,1,3,2,1,2,1}));}
}`,
    },
  },
  ...EXTENDED_PROBLEMS,
];

// ── Demo User ──────────────────────────────────────────────
export const DEMO_USER: User = {
  id: 'demo-user-001',
  name: 'Alex Johnson',
  email: 'alex@college.edu',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  points: 2840,
  rank: 12,
  streak: 7,
  joinedAt: '2024-08-01',
  solvedEasy: 18,
  solvedMedium: 9,
  solvedHard: 2,
  totalSolved: 29,
  topicsProgress: [
    { topic: 'Arrays',            solved: 12, total: 20 },
    { topic: 'Strings',           solved: 8,  total: 15 },
    { topic: 'Dynamic Prog.',     solved: 4,  total: 18 },
    { topic: 'Trees',             solved: 6,  total: 14 },
    { topic: 'Graphs',            solved: 3,  total: 12 },
    { topic: 'Sliding Window',    solved: 5,  total: 8  },
    { topic: 'Binary Search',     solved: 4,  total: 7  },
    { topic: 'Stack',             solved: 3,  total: 6  },
  ],
};

// ── Leaderboard Users ─────────────────────────────────────
export const LEADERBOARD: User[] = [
  { ...DEMO_USER, id: '0', name: 'Priya Sharma',    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',   points: 5420, rank: 1,  streak: 45, solvedEasy: 47, solvedMedium: 31, solvedHard: 12, totalSolved: 90,  topicsProgress: [] },
  { ...DEMO_USER, id: '1', name: 'Rohan Mehra',     avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan',   points: 4980, rank: 2,  streak: 32, solvedEasy: 42, solvedMedium: 28, solvedHard: 10, totalSolved: 80,  topicsProgress: [] },
  { ...DEMO_USER, id: '2', name: 'Sarah Chen',      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',   points: 4210, rank: 3,  streak: 21, solvedEasy: 38, solvedMedium: 22, solvedHard: 8,  totalSolved: 68,  topicsProgress: [] },
  { ...DEMO_USER, id: '3', name: 'Mohamed Ali',     avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mohamed', points: 3760, rank: 4,  streak: 15, solvedEasy: 35, solvedMedium: 18, solvedHard: 5,  totalSolved: 58,  topicsProgress: [] },
  { ...DEMO_USER, id: '4', name: 'Anika Patel',     avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anika',   points: 3540, rank: 5,  streak: 18, solvedEasy: 30, solvedMedium: 17, solvedHard: 4,  totalSolved: 51,  topicsProgress: [] },
  { ...DEMO_USER, id: '5', name: 'James O\'Brien',  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',   points: 3120, rank: 6,  streak: 11, solvedEasy: 28, solvedMedium: 14, solvedHard: 3,  totalSolved: 45,  topicsProgress: [] },
  { ...DEMO_USER, id: '6', name: 'Liu Wei',         avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Liu',     points: 2990, rank: 7,  streak: 9,  solvedEasy: 26, solvedMedium: 13, solvedHard: 2,  totalSolved: 41,  topicsProgress: [] },
  { ...DEMO_USER, id: '7', name: 'Emma Wilson',     avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',    points: 2870, rank: 8,  streak: 7,  solvedEasy: 24, solvedMedium: 11, solvedHard: 2,  totalSolved: 37,  topicsProgress: [] },
  { ...DEMO_USER, id: '8', name: 'Arjun Nair',      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun',   points: 2845, rank: 9,  streak: 6,  solvedEasy: 22, solvedMedium: 10, solvedHard: 2,  totalSolved: 34,  topicsProgress: [] },
  { ...DEMO_USER, id: '9', name: 'Fatima Hassan',   avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima',  points: 2841, rank: 10, streak: 8,  solvedEasy: 21, solvedMedium: 9,  solvedHard: 2,  totalSolved: 32,  topicsProgress: [] },
  { ...DEMO_USER, id: '10', name: 'Carlos Ruiz',    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',  points: 2840, rank: 11, streak: 5,  solvedEasy: 20, solvedMedium: 9,  solvedHard: 2,  totalSolved: 31,  topicsProgress: [] },
  DEMO_USER,
];

// ── Recent Submissions ─────────────────────────────────────
export const RECENT_SUBMISSIONS: Submission[] = [
  { id: 's1', problemId: '1', problemTitle: 'Two Sum',                                  language: 'python', status: 'Accepted',       executionTime: 52,  memory: 14.3, submittedAt: '2026-04-06T10:30:00Z' },
  { id: 's2', problemId: '3', problemTitle: 'Longest Substring Without Repeating',       language: 'cpp',    status: 'Accepted',       executionTime: 12,  memory: 8.1,  submittedAt: '2026-04-05T15:20:00Z' },
  { id: 's3', problemId: '4', problemTitle: 'Maximum Subarray',                          language: 'java',   status: 'Wrong Answer',   executionTime: 0,   memory: 0,    submittedAt: '2026-04-05T14:10:00Z' },
  { id: 's4', problemId: '5', problemTitle: 'Binary Search',                             language: 'python', status: 'Accepted',       executionTime: 38,  memory: 11.2, submittedAt: '2026-04-04T09:00:00Z' },
  { id: 's5', problemId: '10', problemTitle: 'Trapping Rain Water',                      language: 'cpp',    status: 'TLE',            executionTime: 2000,memory: 28.0, submittedAt: '2026-04-03T18:45:00Z' },
];

// ── Helpers ────────────────────────────────────────────────
export function getProblemById(id: string): Problem | undefined {
  return PROBLEMS.find(p => p.id === id);
}

export function getProblemBySlug(slug: string): Problem | undefined {
  return PROBLEMS.find(p => p.slug === slug);
}

export function getFilteredProblems(opts: {
  difficulty?: Difficulty | 'All';
  tag?: string;
  search?: string;
}) {
  return PROBLEMS.filter(p => {
    if (opts.difficulty && opts.difficulty !== 'All' && p.difficulty !== opts.difficulty) return false;
    if (opts.tag && opts.tag !== 'All' && !p.tags.some(t => t.id === opts.tag)) return false;
    if (opts.search && !p.title.toLowerCase().includes(opts.search.toLowerCase())) return false;
    return true;
  });
}
