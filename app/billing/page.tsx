import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { AuthGuard } from '@/components/ui/auth-guard';
import { 
  CreditCard, 
  Download, 
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const mockTransactions = [
  {
    id: 1,
    service: 'Netflix',
    amount: 15.99,
    date: '2025-01-15',
    status: 'completed',
    type: 'subscription'
  },
  {
    id: 2,
    service: 'Spotify Premium',
    amount: 9.99,
    date: '2025-01-10',
    status: 'completed',
    type: 'subscription'
  },
  {
    id: 3,
    service: 'Adobe Creative Suite',
    amount: 52.99,
    date: '2025-01-01',
    status: 'completed',
    type: 'subscription'
  },
  {
    id: 4,
    service: 'YouTube Premium',
    amount: 11.99,
    date: '2024-12-28',
    status: 'failed',
    type: 'subscription'
  },
];

export default function BillingPage() {
  const totalThisMonth = mockTransactions
    .filter(t => new Date(t.date).getMonth() === new Date().getMonth())
    .reduce((sum, t) => sum + (t.status === 'completed' ? t.amount : 0), 0);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Billing & Payments</h1>
              <p className="text-gray-600 mt-2">Manage your payment methods and view transaction history</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">This Month</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalThisMonth.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    +12% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Successful Payments</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {mockTransactions.filter(t => t.status === 'completed').length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Out of {mockTransactions.length} total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Failed Payments</CardTitle>
                  <AlertCircle className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {mockTransactions.filter(t => t.status === 'failed').length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Needs attention
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Payment Methods */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="w-5 h-5 mr-2" />
                      Payment Methods
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="w-8 h-5 bg-blue-600 rounded mr-2"></div>
                          <span className="font-medium">•••• 4242</span>
                        </div>
                        <Badge>Primary</Badge>
                      </div>
                      <p className="text-sm text-gray-600">Expires 12/27</p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="w-8 h-5 bg-red-600 rounded mr-2"></div>
                          <span className="font-medium">•••• 8888</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">Expires 03/26</p>
                    </div>

                    <Button variant="outline" className="w-full">
                      Add Payment Method
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Transaction History */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Recent Transactions</CardTitle>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockTransactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
                              <CreditCard className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">{transaction.service}</h4>
                              <p className="text-sm text-gray-600">
                                {new Date(transaction.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <span className="font-semibold">${transaction.amount}</span>
                            <Badge 
                              variant={transaction.status === 'completed' ? 'default' : 'destructive'}
                              className={transaction.status === 'completed' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                            >
                              {transaction.status === 'completed' ? (
                                <>
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Paid
                                </>
                              ) : (
                                <>
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                  Failed
                                </>
                              )}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Upcoming Payments */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Upcoming Payments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">YouTube Premium</h4>
                        <p className="text-sm text-gray-600">Due Feb 5, 2025</p>
                      </div>
                      <span className="font-semibold text-orange-600">$11.99</span>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Spotify Premium</h4>
                        <p className="text-sm text-gray-600">Due Feb 10, 2025</p>
                      </div>
                      <span className="font-semibold">$9.99</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Footer />
      </div>
    </AuthGuard>
  );
}