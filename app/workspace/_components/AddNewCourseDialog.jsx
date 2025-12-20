'use client';

import React, { use, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button'
import { Loader2Icon, Sparkle } from 'lucide-react'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation'

function AddNewCourseDialog({ children }) {

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        includeVideo: false,
        noOfChapters: 1,
        level: '',
        category: ''
    });
    const router = useRouter();

    const onHandleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        console.log(formData);

    }

    const onGenerate = async () => {
        console.log('Generating course with data:', formData);
        const courseId = uuidv4(); // Generate a unique ID for the course
        try {
            setLoading(true);
            const result = await axios.post('/api/generate-course-layout', {
                ...formData,
                courseId: courseId
            })
            if (result.data.resp == 'limit exceed') {
                toast.warning('You have reached your course creation limit. Please upgrade your plan to create more courses.');
                router.push('workspace/billing');
            }
            setLoading(false);
            router.push('/workspace/edit-course/' + result.data?.courseId);
        } catch (error) {
            console.error('Error generating course:', error);
            setLoading(false);
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-lg">
  <DialogHeader>
    <DialogTitle className="text-xl font-semibold">
      Create New Course Using AI
    </DialogTitle>
    <DialogDescription asChild>
      <div className="flex flex-col gap-5 mt-4">

        {/* Course Name */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Course Name</label>
          <Input
            placeholder="Course Name"
            onChange={(event) =>
              onHandleInputChange("name", event?.target.value)
            }
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">
            Course Description <span className="text-muted-foreground">(Optional)</span>
          </label>
          <Textarea
            placeholder="Brief course overview"
            className="min-h-[90px]"
            onChange={(event) =>
              onHandleInputChange("description", event?.target.value)
            }
          />
        </div>

        {/* Chapters */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Number of Chapters</label>
          <Input
            type="number"
            placeholder="e.g. 10"
            onChange={(event) =>
              onHandleInputChange("noOfChapters", event?.target.value)
            }
          />
        </div>

        {/* Include Video */}
        <div className="flex items-center justify-between rounded-md border p-3">
          <label className="text-sm font-medium">Include Video Content</label>
          <Switch
            onCheckedChange={() =>
              onHandleInputChange("includeVideo", !formData?.includeVideo)
            }
          />
        </div>

        {/* Difficulty */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Difficulty Level</label>
          <Select onValueChange={(value) => onHandleInputChange("level", value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Category</label>
          <Input
            placeholder="AI, Web Development, Design"
            onChange={(event) =>
              onHandleInputChange("category", event?.target.value)
            }
          />
        </div>

        {/* CTA */}
        <div className="pt-4">
          <Button
            className="w-full flex gap-2"
            onClick={onGenerate}
            disabled={loading}
          >
            {loading ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <Sparkle />
            )}
            Generate Course
          </Button>
        </div>

      </div>
    </DialogDescription>
  </DialogHeader>
</DialogContent>

</Dialog>
    )
}

export default AddNewCourseDialog