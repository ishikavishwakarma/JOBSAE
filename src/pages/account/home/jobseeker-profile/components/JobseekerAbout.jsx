import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function JobseekerAbout({ content }) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">About Me</CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          className="text-sm text-secondary-foreground leading-relaxed rich-text-content" 
          dangerouslySetInnerHTML={{ __html: content || '<p className="italic text-muted-foreground">No description provided yet. Edit your profile to add one.</p>' }} 
        />
      </CardContent>
    </Card>
  );
}
