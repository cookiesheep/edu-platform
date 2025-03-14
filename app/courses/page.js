e client';

import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Link from 'next/link';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');

  const fetchCourses = async () => {
    setLoading(true);
    let url = '/api/courses?';
    
    if (searchTerm) {
      url += `search=${encodeURIComponent(searchTerm)}&`;
    }
    
    if (selectedSubject !== 'all') {
      url += `subject=${encodeURIComponent(selectedSubject)}&`;
    }
    
    if (selectedLevel !== 'all') {
      url += `level=${encodeURIComponent(selectedLevel)}&`;
    }
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (response.ok) {
        setCourses(data);
      } else {
        console.error('Error fetching courses:', data.error);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [searchTerm, selectedSubject, selectedLevel]);

  // 其余代码保持不变...
}
