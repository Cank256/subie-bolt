import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { 
  Search, 
  Play, 
  Clock, 
  User,
  BookOpen,
  Video,
  FileText,
  Smartphone,
  CreditCard,
  Bell,
  BarChart3,
  Settings,
  Shield,
  TrendingUp,
  CheckCircle,
  Star
} from 'lucide-react';

const tutorialCategories = [
  {
    title: 'Getting Started',
    icon: BookOpen,
    color: 'bg-blue-100 text-blue-600',
    count: 8
  },
  {
    title: 'Managing Subscriptions',
    icon: CreditCard,
    color: 'bg-purple-100 text-purple-600',
    count: 12
  },
  {
    title: 'Mobile App',
    icon: Smartphone,
    color: 'bg-green-100 text-green-600',
    count: 6
  },
  {
    title: 'Analytics & Reports',
    icon: BarChart3,
    color: 'bg-orange-100 text-orange-600',
    count: 5
  },
  {
    title: 'Notifications',
    icon: Bell,
    color: 'bg-teal-100 text-teal-600',
    count: 4
  },
  {
    title: 'Security',
    icon: Shield,
    color: 'bg-red-100 text-red-600',
    count: 3
  }
];

const featuredTutorials = [
  {
    id: 1,
    title: 'Getting Started with Subie',
    description: 'Learn the basics of setting up your account and adding your first subscription',
    duration: '5 min',
    type: 'video',
    difficulty: 'Beginner',
    views: '12.5k',
    rating: 4.9,
    thumbnail: 'bg-gradient-to-br from-purple-400 to-blue-400'
  },
  {
    id: 2,
    title: 'Setting Up Payment Reminders',
    description: 'Never miss a payment again with smart notification settings',
    duration: '3 min',
    type: 'video',
    difficulty: 'Beginner',
    views: '8.2k',
    rating: 4.8,
    thumbnail: 'bg-gradient-to-br from-green-400 to-teal-400'
  },
  {
    id: 3,
    title: 'Understanding Your Spending Dashboard',
    description: 'Make sense of your subscription analytics and optimize your budget',
    duration: '7 min',
    type: 'video',
    difficulty: 'Intermediate',
    views: '6.1k',
    rating: 4.7,
    thumbnail: 'bg-gradient-to-br from-orange-400 to-red-400'
  }
];

const quickGuides = [
  {
    title: 'How to Add a Subscription',
    steps: 4,
    time: '2 min',
    icon: CreditCard
  },
  {
    title: 'Connecting Your Bank Account',
    steps: 6,
    time: '5 min',
    icon: Shield
  },
  {
    title: 'Setting Budget Limits',
    steps: 3,
    time: '3 min',
    icon: TrendingUp
  },
  {
    title: 'Customizing Notifications',
    steps: 5,
    time: '4 min',
    icon: Bell
  }
];

export default function TutorialsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Tutorials & Guides</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Learn how to make the most of Subie with our comprehensive tutorials and step-by-step guides
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search tutorials, guides, and help articles..."
                className="pl-12 h-12 text-lg border-2 border-gray-200 focus:border-purple-300"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Browse by Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tutorialCategories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${category.color}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{category.title}</h3>
                          <p className="text-gray-600 text-sm">{category.count} tutorials</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Featured Tutorials */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Tutorials</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredTutorials.map((tutorial) => (
                <Card key={tutorial.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className={`h-48 ${tutorial.thumbnail} relative`}>
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <Button size="lg" className="rounded-full w-16 h-16 p-0 bg-white/90 hover:bg-white text-gray-900">
                        <Play className="w-6 h-6 ml-1" />
                      </Button>
                    </div>
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/90 text-gray-900">
                        <Video className="w-3 h-3 mr-1" />
                        {tutorial.duration}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary">{tutorial.difficulty}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2">{tutorial.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{tutorial.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {tutorial.views}
                        </span>
                        <span className="flex items-center">
                          <Star className="w-4 h-4 mr-1 text-yellow-400" />
                          {tutorial.rating}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Guides */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Quick Start Guides</h2>
              <div className="space-y-4">
                {quickGuides.map((guide, index) => {
                  const Icon = guide.icon;
                  return (
                    <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                              <Icon className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold">{guide.title}</h4>
                              <p className="text-gray-600 text-sm">{guide.steps} steps • {guide.time} read</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">
                              <FileText className="w-3 h-3 mr-1" />
                              Guide
                            </Badge>
                            <Button variant="ghost" size="sm">
                              Start →
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Learning Path */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Recommended Learning Path
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h5 className="font-medium text-sm">Account Setup</h5>
                        <p className="text-xs text-gray-600">Complete</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        2
                      </div>
                      <div>
                        <h5 className="font-medium text-sm">Add Subscriptions</h5>
                        <p className="text-xs text-gray-600">In Progress</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xs font-bold">
                        3
                      </div>
                      <div>
                        <h5 className="font-medium text-sm text-gray-500">Set Up Notifications</h5>
                        <p className="text-xs text-gray-500">Not Started</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xs font-bold">
                        4
                      </div>
                      <div>
                        <h5 className="font-medium text-sm text-gray-500">Explore Analytics</h5>
                        <p className="text-xs text-gray-500">Not Started</p>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    Continue Learning
                  </Button>
                </CardContent>
              </Card>

              {/* Popular This Week */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Popular This Week</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-400 rounded"></div>
                      <div>
                        <h5 className="font-medium text-sm">Budget Optimization Tips</h5>
                        <p className="text-xs text-gray-600">3.2k views</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-teal-400 rounded"></div>
                      <div>
                        <h5 className="font-medium text-sm">Mobile App Tour</h5>
                        <p className="text-xs text-gray-600">2.8k views</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-400 rounded"></div>
                      <div>
                        <h5 className="font-medium text-sm">Advanced Analytics</h5>
                        <p className="text-xs text-gray-600">2.1k views</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Need More Help?</h2>
            <p className="text-purple-100 mb-6">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
                Contact Support
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10">
                Join Community
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}