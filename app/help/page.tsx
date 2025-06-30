import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { 
  Search, 
  BookOpen, 
  PlayCircle, 
  MessageCircle, 
  Users,
  TrendingUp,
  CreditCard,
  Bell,
  Settings,
  Shield,
  Smartphone
} from 'lucide-react';

const helpCategories = [
  {
    title: 'Getting Started',
    icon: BookOpen,
    articles: 12,
    description: 'Learn the basics of using Subie',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    title: 'Managing Subscriptions',
    icon: CreditCard,
    articles: 18,
    description: 'Add, edit, and organize your subscriptions',
    color: 'bg-purple-100 text-purple-600'
  },
  {
    title: 'Notifications & Reminders',
    icon: Bell,
    articles: 8,
    description: 'Set up alerts for upcoming payments',
    color: 'bg-green-100 text-green-600'
  },
  {
    title: 'Analytics & Reports',
    icon: TrendingUp,
    articles: 10,
    description: 'Understand your spending patterns',
    color: 'bg-orange-100 text-orange-600'
  },
  {
    title: 'Account Settings',
    icon: Settings,
    articles: 15,
    description: 'Manage your profile and preferences',
    color: 'bg-teal-100 text-teal-600'
  },
  {
    title: 'Security & Privacy',
    icon: Shield,
    articles: 7,
    description: 'Keep your account secure',
    color: 'bg-red-100 text-red-600'
  }
];

const popularArticles = [
  {
    title: 'How to add your first subscription',
    category: 'Getting Started',
    readTime: '3 min',
    views: '2.1k'
  },
  {
    title: 'Setting up payment reminders',
    category: 'Notifications',
    readTime: '2 min',
    views: '1.8k'
  },
  {
    title: 'Understanding your spending dashboard',
    category: 'Analytics',
    readTime: '5 min',
    views: '1.5k'
  },
  {
    title: 'Connecting your bank account safely',
    category: 'Security',
    readTime: '4 min',
    views: '1.3k'
  },
  {
    title: 'Mobile app features guide',
    category: 'Mobile',
    readTime: '6 min',
    views: '1.1k'
  }
];

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Find answers to your questions and learn how to make the most of Subie
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search for help articles, tutorials, and more..."
                className="pl-12 h-12 text-lg border-2 border-gray-200 focus:border-purple-300"
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <PlayCircle className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Video Tutorials</h3>
                <p className="text-gray-600 text-sm">Watch step-by-step guides</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <MessageCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Live Chat</h3>
                <p className="text-gray-600 text-sm">Get instant help from our team</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Community</h3>
                <p className="text-gray-600 text-sm">Connect with other users</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Help Categories */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {helpCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Card key={category.title} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${category.color}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{category.title}</CardTitle>
                            <p className="text-sm text-gray-600">{category.articles} articles</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">{category.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Popular Articles */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Articles</h2>
              <Card>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {popularArticles.map((article, index) => (
                      <div key={index} className="p-4 hover:bg-gray-50 cursor-pointer">
                        <h4 className="font-medium mb-2">{article.title}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <Badge variant="secondary">{article.category}</Badge>
                          <span>{article.readTime} read</span>
                          <span>{article.views} views</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Contact Support */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Still Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 text-sm">
                    Can't find what you're looking for? Our support team is here to help.
                  </p>
                  <div className="space-y-2">
                    <Button className="w-full" variant="outline">
                      Contact Support
                    </Button>
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                      Start Live Chat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Featured Guides */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-32 bg-gradient-to-r from-purple-400 to-blue-400"></div>
                <CardContent className="p-6">
                  <div className="flex items-center mb-2">
                    <Smartphone className="w-5 h-5 text-purple-600 mr-2" />
                    <Badge>Mobile</Badge>
                  </div>
                  <h3 className="font-semibold mb-2">Getting Started with Mobile App</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Learn how to use Subie on your phone and set up notifications
                  </p>
                  <Button variant="outline" size="sm">Read Guide</Button>
                </CardContent>
              </Card>

              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-32 bg-gradient-to-r from-green-400 to-teal-400"></div>
                <CardContent className="p-6">
                  <div className="flex items-center mb-2">
                    <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                    <Badge>Analytics</Badge>
                  </div>
                  <h3 className="font-semibold mb-2">Understanding Your Spending</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Make sense of your subscription analytics and optimize your budget
                  </p>
                  <Button variant="outline" size="sm">Read Guide</Button>
                </CardContent>
              </Card>

              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-32 bg-gradient-to-r from-orange-400 to-red-400"></div>
                <CardContent className="p-6">
                  <div className="flex items-center mb-2">
                    <Shield className="w-5 h-5 text-red-600 mr-2" />
                    <Badge>Security</Badge>
                  </div>
                  <h3 className="font-semibold mb-2">Keeping Your Data Safe</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Best practices for account security and data protection
                  </p>
                  <Button variant="outline" size="sm">Read Guide</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}