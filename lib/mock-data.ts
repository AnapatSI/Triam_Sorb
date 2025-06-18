"use client"

// Mock data for development and testing

export const mockLessons = [
  {
    id: "1",
    title: "Introduction to Machine Learning",
    content: `Machine learning is a subset of artificial intelligence (AI) that enables computers to learn and make decisions from data without being explicitly programmed for every task. 

Key concepts include:

1. **Supervised Learning**: Learning with labeled data where the algorithm learns from input-output pairs. Examples include email spam detection and image classification.

2. **Unsupervised Learning**: Finding patterns in data without labeled examples. Common techniques include clustering and dimensionality reduction.

3. **Reinforcement Learning**: Learning through trial and error with rewards and penalties. This is used in game playing AI and robotics.

The machine learning process typically involves:
- Data collection and preprocessing
- Model selection and training
- Evaluation and testing
- Deployment and monitoring

Machine learning algorithms can identify complex patterns in large datasets that would be impossible for humans to detect manually.`,
    category: "AI/ML",
    difficulty: "Beginner",
    estimatedTime: "15 min",
  },
  {
    id: "2",
    title: "React Hooks Deep Dive",
    content: `React Hooks are functions that let you use state and other React features in functional components. They were introduced in React 16.8 and have revolutionized how we write React applications.

**Core Hooks:**

1. **useState**: Manages local state in functional components
   - Returns current state value and setter function
   - Can initialize with primitive values or functions

2. **useEffect**: Handles side effects and lifecycle events
   - Runs after every render by default
   - Can be controlled with dependency arrays
   - Supports cleanup functions for subscriptions

3. **useContext**: Consumes context values without nesting
   - Provides access to React context
   - Eliminates prop drilling

**Advanced Hooks:**

4. **useReducer**: Alternative to useState for complex state logic
5. **useMemo**: Memoizes expensive calculations
6. **useCallback**: Memoizes function references
7. **useRef**: Creates mutable references that persist across renders

**Custom Hooks:**
You can create your own hooks to share stateful logic between components. Custom hooks are just JavaScript functions that use other hooks.

Example:
\`\`\`javascript
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue)
  const increment = () => setCount(count + 1)
  const decrement = () => setCount(count - 1)
  return { count, increment, decrement }
}
\`\`\`

Hooks follow two important rules:
1. Only call hooks at the top level of functions
2. Only call hooks from React functions or custom hooks`,
    category: "Web Development",
    difficulty: "Intermediate",
    estimatedTime: "20 min",
  },
]

export const mockFeedback = {
  comprehension_score: 85,
  strengths: [
    "Correctly identified machine learning as a subset of AI",
    "Understood the concept of learning from data without explicit programming",
    "Mentioned pattern recognition as a key component",
    "Demonstrated understanding of the basic ML workflow",
  ],
  improvements: [
    "Could elaborate more on the three types of machine learning",
    "Missing explanation of supervised vs unsupervised learning differences",
    "Did not mention reinforcement learning",
    "Could provide more concrete examples",
  ],
  suggestions: [
    "Try to provide examples for each type of machine learning",
    "Consider explaining the difference between training and prediction phases",
    "Think about real-world applications you might have encountered",
    "Practice explaining technical concepts in simpler terms",
  ],
  detailed_feedback: `Your understanding demonstrates a solid grasp of the fundamental concepts of machine learning. You correctly identified it as a subset of artificial intelligence and understood the core principle of learning from data without explicit programming.

**What you did well:**
- Clear explanation of the basic definition
- Good understanding of pattern recognition
- Mentioned the importance of data in ML

**Areas to strengthen:**
- The lesson covered three main types of ML (supervised, unsupervised, reinforcement) but your response only touched on the general concept
- Consider providing specific examples to illustrate your understanding
- The ML process steps could be mentioned to show deeper comprehension

**Next steps:**
Focus on the different types of machine learning and try to think of examples for each. This will help solidify your understanding and demonstrate more comprehensive knowledge.`,
}

export const mockLearningHistory = [
  {
    id: "1",
    lesson_title: "Introduction to Machine Learning",
    date: "2024-01-15",
    comprehension_score: 85,
    time_spent: 12,
    category: "AI/ML",
    status: "completed",
  },
  {
    id: "2",
    lesson_title: "React Hooks Deep Dive",
    date: "2024-01-14",
    comprehension_score: 92,
    time_spent: 18,
    category: "Web Development",
    status: "completed",
  },
  {
    id: "3",
    lesson_title: "Database Normalization",
    date: "2024-01-13",
    comprehension_score: 78,
    time_spent: 15,
    category: "Database",
    status: "completed",
  },
  {
    id: "4",
    lesson_title: "Python Data Structures",
    date: "2024-01-12",
    comprehension_score: 88,
    time_spent: 20,
    category: "Programming",
    status: "completed",
  },
  {
    id: "5",
    lesson_title: "Network Security Basics",
    date: "2024-01-11",
    comprehension_score: 76,
    time_spent: 25,
    category: "Security",
    status: "completed",
  },
]

export const mockUserStats = {
  total_lessons: 15,
  average_score: 84,
  total_time_spent: 240, // minutes
  current_streak: 7,
  best_category: "Web Development",
  improvement_areas: ["Database", "Security"],
}
