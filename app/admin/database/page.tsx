'use client';

import { useState, useEffect } from 'react'
import { AdminGuard } from '@/components/ui/admin-guard'
import { AdminLayout } from '@/components/ui/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Database, 
  Play, 
  Download, 
  Upload, 
  RefreshCw, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

interface TableInfo {
  table_name: string
  row_count: number
  size_bytes: number
}

interface QueryResult {
  columns: string[]
  rows: any[][]
  rowCount: number
  executionTime: number
}

export default function AdminDatabasePage() {
  const [tables, setTables] = useState<TableInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [queryLoading, setQueryLoading] = useState(false)
  const [sqlQuery, setSqlQuery] = useState('')
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null)
  const [queryError, setQueryError] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking')

  useEffect(() => {
    checkConnection()
    fetchTableInfo()
  }, [])

  const checkConnection = async () => {
    try {
      setConnectionStatus('checking')
      const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true })
      setConnectionStatus(error ? 'disconnected' : 'connected')
    } catch (error) {
      setConnectionStatus('disconnected')
    }
  }

  const fetchTableInfo = async () => {
    try {
      setLoading(true)
      
      // Get table information
      const tableNames = ['users', 'subscriptions', 'subscription_categories', 'transactions']
      const tableInfo: TableInfo[] = []
      
      for (const tableName of tableNames) {
        try {
          const { count } = await supabase
            .from(tableName)
            .select('*', { count: 'exact', head: true })
          
          tableInfo.push({
            table_name: tableName,
            row_count: count || 0,
            size_bytes: 0 // Placeholder - would need admin access to get actual size
          })
        } catch (error) {
          console.error(`Error fetching info for table ${tableName}:`, error)
        }
      }
      
      setTables(tableInfo)
    } catch (error) {
      console.error('Error fetching table info:', error)
    } finally {
      setLoading(false)
    }
  }

  const executeQuery = async () => {
    if (!sqlQuery.trim()) return
    
    try {
      setQueryLoading(true)
      setQueryError(null)
      setQueryResult(null)
      
      const startTime = Date.now()
      
      // For safety, only allow SELECT queries
      const trimmedQuery = sqlQuery.trim().toLowerCase()
      if (!trimmedQuery.startsWith('select')) {
        throw new Error('Only SELECT queries are allowed for security reasons')
      }
      
      const { data, error } = await supabase.rpc('execute_sql', { query: sqlQuery })
      
      if (error) throw error
      
      const executionTime = Date.now() - startTime
      
      if (data && data.length > 0) {
        const columns = Object.keys(data[0])
        const rows = data.map((row: any) => columns.map(col => row[col]))
        
        setQueryResult({
          columns,
          rows,
          rowCount: data.length,
          executionTime
        })
      } else {
        setQueryResult({
          columns: [],
          rows: [],
          rowCount: 0,
          executionTime
        })
      }
    } catch (error) {
      setQueryError(error instanceof Error ? error.message : 'Query execution failed')
    } finally {
      setQueryLoading(false)
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const sampleQueries = [
    {
      name: 'User Statistics',
      query: 'SELECT role, COUNT(*) as count FROM users GROUP BY role ORDER BY count DESC;'
    },
    {
      name: 'Active Subscriptions',
      query: 'SELECT status, COUNT(*) as count FROM subscriptions GROUP BY status;'
    },
    {
      name: 'Recent Users',
      query: 'SELECT email, created_at, role FROM users ORDER BY created_at DESC LIMIT 10;'
    },
    {
      name: 'Revenue by Month',
      query: `SELECT 
        DATE_TRUNC('month', created_at) as month,
        SUM(amount) as total_revenue
      FROM transactions 
      WHERE status = 'completed'
      GROUP BY month 
      ORDER BY month DESC 
      LIMIT 12;`
    }
  ]

  return (
    <AdminGuard requireAdmin={true}>
      <AdminLayout>
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <Database className="w-8 h-8 mr-3 text-purple-600" />
                  Database Management
                </h1>
                <p className="text-gray-600 mt-1">Monitor database health and execute queries</p>
              </div>
              <div className="flex items-center space-x-3">
                <Badge 
                  variant={connectionStatus === 'connected' ? 'default' : 'destructive'}
                  className="flex items-center space-x-1"
                >
                  {connectionStatus === 'connected' ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : connectionStatus === 'disconnected' ? (
                    <XCircle className="w-3 h-3" />
                  ) : (
                    <RefreshCw className="w-3 h-3 animate-spin" />
                  )}
                  <span>{connectionStatus === 'connected' ? 'Connected' : connectionStatus === 'disconnected' ? 'Disconnected' : 'Checking'}</span>
                </Badge>
                <Button onClick={checkConnection} variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="query">Query Editor</TabsTrigger>
              <TabsTrigger value="backup">Backup & Restore</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Database Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Tables</p>
                        <p className="text-2xl font-bold text-gray-900">{tables.length}</p>
                      </div>
                      <Database className="w-8 h-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Records</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {tables.reduce((sum, table) => sum + table.row_count, 0).toLocaleString()}
                        </p>
                      </div>
                      <Info className="w-8 h-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Database Size</p>
                        <p className="text-2xl font-bold text-gray-900">~2.5 MB</p>
                      </div>
                      <AlertTriangle className="w-8 h-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tables Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Tables Overview</CardTitle>
                  <CardDescription>Database tables and their record counts</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <RefreshCw className="w-6 h-6 animate-spin" />
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Table Name</TableHead>
                          <TableHead>Record Count</TableHead>
                          <TableHead>Estimated Size</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tables.map((table) => (
                          <TableRow key={table.table_name}>
                            <TableCell className="font-medium">{table.table_name}</TableCell>
                            <TableCell>{table.row_count.toLocaleString()}</TableCell>
                            <TableCell>{formatBytes(table.size_bytes || 1024 * table.row_count)}</TableCell>
                            <TableCell>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSqlQuery(`SELECT * FROM ${table.table_name} LIMIT 10;`)}
                              >
                                View Sample
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="query" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Query Editor */}
                <div className="lg:col-span-2 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>SQL Query Editor</CardTitle>
                      <CardDescription>Execute read-only queries against the database</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                          Only SELECT queries are allowed for security reasons. Write operations are restricted.
                        </AlertDescription>
                      </Alert>
                      
                      <Textarea
                        placeholder="Enter your SQL query here..."
                        value={sqlQuery}
                        onChange={(e) => setSqlQuery(e.target.value)}
                        className="min-h-[200px] font-mono"
                      />
                      
                      <div className="flex space-x-2">
                        <Button onClick={executeQuery} disabled={queryLoading || !sqlQuery.trim()}>
                          <Play className="w-4 h-4 mr-2" />
                          {queryLoading ? 'Executing...' : 'Execute Query'}
                        </Button>
                        <Button variant="outline" onClick={() => setSqlQuery('')}>
                          Clear
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Query Results */}
                  {(queryResult || queryError) && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Query Results</CardTitle>
                        {queryResult && (
                          <CardDescription>
                            {queryResult.rowCount} rows returned in {queryResult.executionTime}ms
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        {queryError ? (
                          <Alert variant="destructive">
                            <XCircle className="h-4 w-4" />
                            <AlertDescription>{queryError}</AlertDescription>
                          </Alert>
                        ) : queryResult ? (
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  {queryResult.columns.map((column) => (
                                    <TableHead key={column}>{column}</TableHead>
                                  ))}
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {queryResult.rows.slice(0, 100).map((row, index) => (
                                  <TableRow key={index}>
                                    {row.map((cell, cellIndex) => (
                                      <TableCell key={cellIndex}>
                                        {cell === null ? (
                                          <span className="text-gray-400 italic">NULL</span>
                                        ) : (
                                          String(cell)
                                        )}
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                            {queryResult.rows.length > 100 && (
                              <p className="text-sm text-gray-500 mt-2">
                                Showing first 100 rows of {queryResult.rowCount} total rows
                              </p>
                            )}
                          </div>
                        ) : null}
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Sample Queries */}
                <Card>
                  <CardHeader>
                    <CardTitle>Sample Queries</CardTitle>
                    <CardDescription>Common queries to get you started</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {sampleQueries.map((sample, index) => (
                        <div key={index}>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left h-auto p-3"
                            onClick={() => setSqlQuery(sample.query)}
                          >
                            <div>
                              <div className="font-medium">{sample.name}</div>
                              <div className="text-xs text-gray-500 mt-1 truncate">
                                {sample.query.split('\n')[0]}...
                              </div>
                            </div>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="backup" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Database Backup</CardTitle>
                    <CardDescription>Export database data for backup purposes</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        Backup functionality requires additional server-side implementation for security.
                      </AlertDescription>
                    </Alert>
                    <Button disabled className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Export Database
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Database Restore</CardTitle>
                    <CardDescription>Restore database from backup file</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Restore operations are high-risk and require additional security measures.
                      </AlertDescription>
                    </Alert>
                    <Button disabled variant="destructive" className="w-full">
                      <Upload className="w-4 h-4 mr-2" />
                      Restore Database
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </AdminLayout>
    </AdminGuard>
  )
}